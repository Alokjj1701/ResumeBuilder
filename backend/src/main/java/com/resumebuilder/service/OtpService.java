package com.resumebuilder.service;

import com.resumebuilder.entity.OtpToken;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.OtpTokenRepository;
import com.resumebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    public static final String PURPOSE_EMAIL_VERIFY = "EMAIL_VERIFY";
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final OtpTokenRepository otpTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    // ── Generate and send OTP ────────────────────────────────────────────────

    @Transactional
    public void generateAndSend(User user, String purpose) {
        // Enforce resend cooldown — check if a recent OTP was already issued
        otpTokenRepository
                .findFirstByUserAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(user, purpose)
                .ifPresent(existing -> {
                    if (existing.getCreatedAt() != null &&
                        existing.getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(LocalDateTime.now())) {
                        long secondsLeft = java.time.Duration.between(
                                LocalDateTime.now(),
                                existing.getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS)
                        ).getSeconds();
                        throw new IllegalStateException(
                                "Please wait " + secondsLeft + " seconds before requesting a new code");
                    }
                });

        // Invalidate all previous active OTPs for this user + purpose
        otpTokenRepository.invalidateAllByUserAndPurpose(user, purpose);

        String code = generateCode();

        OtpToken otpToken = OtpToken.builder()
                .user(user)
                .otpCode(code)
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .attemptCount(0)
                .maxAttempts(3)
                .isUsed(false)
                .build();

        otpTokenRepository.save(otpToken);

        // Email is sent after the OTP row is flushed. If sending fails the OTP
        // row rolls back, but the user row (committed in AuthService.createUser)
        // is unaffected — the user can retry via resend-otp.
        emailService.sendOtpEmail(user.getEmail(), code, user.getFullName());
        log.info("OTP generated for user: {} purpose: {}", user.getEmail(), purpose);
    }

    // ── Verify OTP and mark user as verified ─────────────────────────────────

    @Transactional
    public User verify(String email, String otp, String purpose) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid verification code"));

        OtpToken token = otpTokenRepository
                .findFirstByUserAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(user, purpose)
                .orElseThrow(() -> new BadCredentialsException("No active verification code found. Please request a new one."));

        // Check expiry
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            token.setUsed(true);
            otpTokenRepository.save(token);
            throw new BadCredentialsException("Verification code has expired. Please request a new one.");
        }

        // Check attempt limit
        if (token.getAttemptCount() >= token.getMaxAttempts()) {
            token.setUsed(true);
            otpTokenRepository.save(token);
            throw new BadCredentialsException("Too many incorrect attempts. Please request a new code.");
        }

        // Check code
        if (!token.getOtpCode().equals(otp)) {
            token.setAttemptCount(token.getAttemptCount() + 1);
            otpTokenRepository.save(token);
            int remaining = token.getMaxAttempts() - token.getAttemptCount();
            throw new BadCredentialsException(
                    "Incorrect code. " + remaining + " attempt" + (remaining == 1 ? "" : "s") + " remaining.");
        }

        // OTP is valid — mark used, mark user verified
        token.setUsed(true);
        otpTokenRepository.save(token);

        if (!user.isVerified()) {
            user.setVerified(true);
            userRepository.save(user);
        }

        log.info("Email verified for user: {}", user.getEmail());
        return user;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private String generateCode() {
        int code = 100000 + new SecureRandom().nextInt(900000);
        return String.valueOf(code);
    }
}
