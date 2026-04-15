package com.resumebuilder.service;

import com.resumebuilder.dto.auth.AuthResponse;
import com.resumebuilder.dto.auth.LoginRequest;
import com.resumebuilder.dto.auth.RegisterRequest;
import com.resumebuilder.dto.auth.RegisterResponse;
import com.resumebuilder.dto.auth.ResendOtpRequest;
import com.resumebuilder.dto.auth.VerifyOtpRequest;
import com.resumebuilder.entity.RefreshToken;
import com.resumebuilder.entity.User;
import com.resumebuilder.exception.EmailNotVerifiedException;
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
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    @Value("${app.jwt.refresh-token-expiry-days:7}")
    private long refreshTokenExpiryDays;

    // ── UserDetailsService (required by Spring Security) ────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // ── Register ─────────────────────────────────────────────────────────────

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .provider("local")
                .isVerified(false)   // Must verify email with OTP before accessing the app
                .isActive(true)
                .build();

        userRepository.save(user);
        log.info("New user registered (unverified): {}", user.getEmail());

        // Generate OTP and send email (async)
        otpService.generateAndSend(user, OtpService.PURPOSE_EMAIL_VERIFY);

        return RegisterResponse.builder()
                .email(email)
                .message("We've sent a 6-digit code to " + email + ". Enter it to activate your account.")
                .build();
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

        // Block unverified users — prompt them to finish OTP verification
        if (!user.isVerified()) {
            throw new EmailNotVerifiedException(user.getEmail());
        }

        log.info("User logged in: {}", user.getEmail());
        return issueTokens(user);
    }

    // ── OTP Verification ─────────────────────────────────────────────────────

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = otpService.verify(
                request.getEmail(), request.getOtp(), OtpService.PURPOSE_EMAIL_VERIFY);
        log.info("User verified and logged in: {}", user.getEmail());
        return issueTokens(user);
    }

    // ── Resend OTP ───────────────────────────────────────────────────────────

    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("No account found with this email"));

        if (user.isVerified()) {
            throw new IllegalArgumentException("This account is already verified");
        }

        otpService.generateAndSend(user, OtpService.PURPOSE_EMAIL_VERIFY);
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
