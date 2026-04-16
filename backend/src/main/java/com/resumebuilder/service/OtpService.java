package com.resumebuilder.service;

import com.resumebuilder.entity.OtpToken;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.OtpTokenRepository;
import com.resumebuilder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    public static final String PURPOSE_EMAIL_VERIFY   = "EMAIL_VERIFY";
    public static final String PURPOSE_PASSWORD_RESET = "PASSWORD_RESET";
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final OtpTokenRepository otpTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    // Password-reset variant — sends a dedicated "reset your password" email
    @Transactional
    public void generateAndSendPasswordReset(User user) {
        enforceCooldown(user, PURPOSE_PASSWORD_RESET);
        otpTokenRepository.invalidateAllByUserAndPurpose(user, PURPOSE_PASSWORD_RESET);
        String code = generateCode();
        otpTokenRepository.save(OtpToken.builder()
                .user(user)
                .otpCode(code)
                .purpose(PURPOSE_PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .attemptCount(0)
                .maxAttempts(3)
                .isUsed(false)
                .build());
        emailService.sendPasswordResetEmail(user.getEmail(), code, user.getFullName());
        log.info("Password-reset OTP sent to: {}", user.getEmail());
    }

    @Transactional
    public void generateAndSend(User user, String purpose) {
        enforceCooldown(user, purpose);

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
        emailService.sendOtpEmail(user.getEmail(), code, user.getFullName());
        log.info("OTP generated for user: {} purpose: {}", user.getEmail(), purpose);
    }

    @Transactional
    public User verify(String email, String otp, String purpose) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid verification code"));

        OtpToken token = otpTokenRepository
                .findFirstByUserAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(user, purpose)
                .orElseThrow(() -> new BadCredentialsException("No active verification code found. Please request a new one."));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            token.setUsed(true);
            otpTokenRepository.save(token);
            throw new BadCredentialsException("Verification code has expired. Please request a new one.");
        }

        if (token.getAttemptCount() >= token.getMaxAttempts()) {
            token.setUsed(true);
            otpTokenRepository.save(token);
            throw new BadCredentialsException("Too many incorrect attempts. Please request a new code.");
        }

        if (!token.getOtpCode().equals(otp)) {
            token.setAttemptCount(token.getAttemptCount() + 1);
            otpTokenRepository.save(token);
            int remaining = token.getMaxAttempts() - token.getAttemptCount();
            throw new BadCredentialsException(
                    "Incorrect code. " + remaining + " attempt" + (remaining == 1 ? "" : "s") + " remaining.");
        }

        token.setUsed(true);
        otpTokenRepository.save(token);

        if (!user.isVerified()) {
            user.setVerified(true);
            userRepository.save(user);
        }

        log.info("Email verified for user: {}", user.getEmail());
        return user;
    }

    private void enforceCooldown(User user, String purpose) {
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
    }

    private String generateCode() {
        int code = 100000 + new SecureRandom().nextInt(900000);
        return String.valueOf(code);
    }
}
