package com.resumebuilder.controller;

import com.resumebuilder.dto.auth.AuthResponse;
import com.resumebuilder.dto.auth.LoginRequest;
import com.resumebuilder.dto.auth.RegisterRequest;
import com.resumebuilder.dto.auth.RegisterResponse;
import com.resumebuilder.dto.auth.ResendOtpRequest;
import com.resumebuilder.dto.auth.VerifyOtpRequest;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.jwt.refresh-token-expiry-days:7}")
    private int refreshTokenExpiryDays;

    // ── Register ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(response);
        // No tokens — user must verify OTP first
    }

    // ── Login ────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.login(request);
        setRefreshCookie(response, authResponse.getRefreshTokenValue());
        return ResponseEntity.ok(authResponse);
    }

    // ── OTP Verification ─────────────────────────────────────────────────────

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.verifyOtp(request);
        setRefreshCookie(response, authResponse.getRefreshTokenValue());
        return ResponseEntity.ok(authResponse);
    }

    // ── Resend OTP ───────────────────────────────────────────────────────────

    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, String>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok(Map.of("message", "A new verification code has been sent to " + request.getEmail()));
    }

    // ── Refresh ──────────────────────────────────────────────────────────────

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshTokenValue = extractRefreshCookie(request);
        AuthResponse authResponse = authService.refresh(refreshTokenValue);
        setRefreshCookie(response, authResponse.getRefreshTokenValue());
        return ResponseEntity.ok(authResponse);
    }

    // ── Logout ───────────────────────────────────────────────────────────────

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshTokenValue = extractRefreshCookie(request);
        authService.logout(refreshTokenValue);
        clearRefreshCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // ── Me ───────────────────────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserInfo> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .verified(user.isVerified())
                        .build()
        );
    }

    // ── Cookie helpers ───────────────────────────────────────────────────────

    private void setRefreshCookie(HttpServletResponse response, String tokenValue) {
        Cookie cookie = new Cookie("refreshToken", tokenValue);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(refreshTokenExpiryDays * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
