package com.resumebuilder.service;

import com.resumebuilder.dto.auth.AuthResponse;
import com.resumebuilder.dto.auth.LoginRequest;
import com.resumebuilder.dto.auth.RegisterRequest;
import com.resumebuilder.dto.auth.RegisterResponse;
import com.resumebuilder.dto.auth.ResendOtpRequest;
import com.resumebuilder.dto.auth.VerifyOtpRequest;
import com.resumebuilder.entity.PendingRegistration;
import com.resumebuilder.entity.RefreshToken;
import com.resumebuilder.entity.User;
import com.resumebuilder.exception.EmailNotVerifiedException;
import com.resumebuilder.repository.PendingRegistrationRepository;
import com.resumebuilder.repository.RefreshTokenRepository;
import com.resumebuilder.repository.UserRepository;
import com.resumebuilder.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.jwt.refresh-token-expiry-days:7}")
    private long refreshTokenExpiryDays;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    private static final int RESEND_COOLDOWN_SECONDS = 60;

    // ── UserDetailsService (required by Spring Security) ────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // ── Register ─────────────────────────────────────────────────────────────
    // Saves to pending_registrations — NO user row is created yet.
    // The real users row is only inserted after OTP verification succeeds.

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String fullName = request.getFullName().trim();

        // Reject if a verified account already exists for this email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String code = generateOtpCode();
        LocalDateTime now = LocalDateTime.now();

        // Upsert: update existing pending record (re-registration attempt) or create new one
        PendingRegistration pending = pendingRegistrationRepository.findByEmail(email)
                .map(existing -> {
                    existing.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                    existing.setFullName(fullName);
                    existing.setOtpCode(code);
                    existing.setExpiresAt(now.plusMinutes(otpExpiryMinutes));
                    existing.setOtpSentAt(now);
                    existing.setAttemptCount(0);
                    return existing;
                })
                .orElseGet(() -> PendingRegistration.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode(request.getPassword()))
                        .fullName(fullName)
                        .otpCode(code)
                        .expiresAt(now.plusMinutes(otpExpiryMinutes))
                        .otpSentAt(now)
                        .build());

        pendingRegistrationRepository.save(pending);

        // Email is sent inside the transaction — if it fails the pending record
        // rolls back and the user can simply try registering again.
        emailService.sendOtpEmail(email, code, fullName);
        log.info("Pending registration + OTP sent for: {}", email);

        return RegisterResponse.builder()
                .email(email)
                .message("We've sent a 6-digit code to " + email + ". Enter it to activate your account.")
                .build();
    }

    // ── OTP Verification ─────────────────────────────────────────────────────
    // Checks pending_registrations. On success: creates the real user and issues tokens.
    // noRollbackFor: attempt-count increments and deletes must persist even when
    // we throw BadCredentialsException — they are intentional DB writes, not failures.

    @Transactional(noRollbackFor = BadCredentialsException.class)
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String otp   = request.getOtp();

        PendingRegistration pending = pendingRegistrationRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("No pending registration found. Please register first."));

        // Check expiry
        if (pending.getExpiresAt().isBefore(LocalDateTime.now())) {
            pendingRegistrationRepository.delete(pending);
            throw new BadCredentialsException("Verification code has expired. Please register again.");
        }

        // Check attempt limit
        if (pending.getAttemptCount() >= pending.getMaxAttempts()) {
            pendingRegistrationRepository.delete(pending);
            throw new BadCredentialsException("Too many incorrect attempts. Please register again.");
        }

        // Check code
        if (!pending.getOtpCode().equals(otp)) {
            pending.setAttemptCount(pending.getAttemptCount() + 1);
            pendingRegistrationRepository.save(pending);
            int remaining = pending.getMaxAttempts() - pending.getAttemptCount();
            throw new BadCredentialsException(
                    "Incorrect code. " + remaining + " attempt" + (remaining == 1 ? "" : "s") + " remaining.");
        }

        // OTP is valid — create the verified user and remove the pending record
        User user = User.builder()
                .email(pending.getEmail())
                .passwordHash(pending.getPasswordHash())
                .fullName(pending.getFullName())
                .provider("local")
                .isVerified(true)
                .isActive(true)
                .build();

        userRepository.save(user);
        pendingRegistrationRepository.delete(pending);

        log.info("User registered and verified: {}", email);
        return issueTokens(user);
    }

    // ── Resend OTP ───────────────────────────────────────────────────────────

    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        PendingRegistration pending = pendingRegistrationRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("No pending registration found for this email. Please register first."));

        // Enforce cooldown
        if (pending.getOtpSentAt() != null &&
                pending.getOtpSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(LocalDateTime.now())) {
            long secondsLeft = java.time.Duration.between(
                    LocalDateTime.now(),
                    pending.getOtpSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS)
            ).getSeconds();
            throw new IllegalStateException("Please wait " + secondsLeft + " seconds before requesting a new code");
        }

        String code = generateOtpCode();
        LocalDateTime now = LocalDateTime.now();
        pending.setOtpCode(code);
        pending.setExpiresAt(now.plusMinutes(otpExpiryMinutes));
        pending.setOtpSentAt(now);
        pending.setAttemptCount(0);
        pendingRegistrationRepository.save(pending);

        emailService.sendOtpEmail(email, code, pending.getFullName());
        log.info("OTP resent for pending registration: {}", email);
    }

    // ── Login ────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadCredentialsException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // All users in the users table are verified — this is a safety guard
        if (!user.isVerified()) {
            throw new EmailNotVerifiedException(user.getEmail());
        }

        log.info("User logged in: {}", user.getEmail());
        return issueTokens(user);
    }

    // ── Refresh ──────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            throw new BadCredentialsException("Refresh token is missing");
        }

        String hash = hashToken(refreshTokenValue);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (stored.isRevoked()) {
            throw new BadCredentialsException("Refresh token has been revoked");
        }

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Refresh token has expired");
        }

        // Rotate: revoke old, issue new
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = stored.getUser();
        log.debug("Refresh token rotated for user: {}", user.getEmail());
        return issueTokens(user);
    }

    // ── Logout ───────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            return;
        }
        String hash = hashToken(refreshTokenValue);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void logoutAll(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshTokenValue = jwtService.generateRefreshTokenValue();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(refreshTokenValue))
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpiryDays))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshTokenValue(refreshTokenValue)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .verified(user.isVerified())
                        .build())
                .build();
    }

    private String generateOtpCode() {
        int code = 100000 + new SecureRandom().nextInt(900000);
        return String.valueOf(code);
    }

    public String hashToken(String tokenValue) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(tokenValue.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
