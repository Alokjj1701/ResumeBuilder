package com.resumebuilder.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP-based rate limiter for auth endpoints using Bucket4j token-bucket algorithm.
 * Each IP gets its own bucket per endpoint category. Buckets are created lazily.
 */
@Component
@Order(1)
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    // ip:endpoint-key → bucket
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only rate-limit auth endpoints
        if (!path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = resolveClientIp(request);
        String bucketKey = ip + ":" + endpointKey(path);
        Bucket bucket = buckets.computeIfAbsent(bucketKey, k -> createBucket(path));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP={} path={}", ip, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"status\":429,\"error\":\"Too Many Requests\"," +
                    "\"message\":\"Too many requests. Please slow down and try again later.\"}");
        }
    }

    private Bucket createBucket(String path) {
        Bandwidth limit = switch (endpointKey(path)) {
            // Login: 10 attempts per minute — blocks brute-force credential stuffing
            case "login"       -> Bandwidth.builder().capacity(10).refillGreedy(10, Duration.ofMinutes(1)).build();
            // Register: 5 registrations per minute per IP — blocks account farming
            case "register"    -> Bandwidth.builder().capacity(5).refillGreedy(5, Duration.ofMinutes(1)).build();
            // OTP verify: 15 per minute — OTP itself limits attempts; this stops spray attacks
            case "verify-otp"  -> Bandwidth.builder().capacity(15).refillGreedy(15, Duration.ofMinutes(1)).build();
            // Resend OTP: 5 per minute — prevents email flooding
            case "resend-otp"  -> Bandwidth.builder().capacity(5).refillGreedy(5, Duration.ofMinutes(1)).build();
            // Refresh: 30 per minute — active apps refresh frequently
            case "refresh"     -> Bandwidth.builder().capacity(30).refillGreedy(30, Duration.ofMinutes(1)).build();
            // Other /auth/* endpoints
            default            -> Bandwidth.builder().capacity(20).refillGreedy(20, Duration.ofMinutes(1)).build();
        };
        return Bucket.builder().addLimit(limit).build();
    }

    private String endpointKey(String path) {
        // Normalise to just the last path segment so e.g. /auth/login and /auth/login/ both match
        if (path.contains("login"))      return "login";
        if (path.contains("register"))   return "register";
        if (path.contains("verify-otp")) return "verify-otp";
        if (path.contains("resend-otp")) return "resend-otp";
        if (path.contains("refresh"))    return "refresh";
        return "other";
    }

    /**
     * Resolves the real client IP, respecting Railway's X-Forwarded-For proxy header.
     */
    private String resolveClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // XFF is a comma-separated list; the first entry is the original client
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
