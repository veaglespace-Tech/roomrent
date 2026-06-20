package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.auth.AuthResponse;
import com.roomrentmaharashtra.dto.auth.ForgotPasswordRequest;
import com.roomrentmaharashtra.dto.auth.LoginRequest;
import com.roomrentmaharashtra.dto.auth.GenericMessageResponse;
import com.roomrentmaharashtra.dto.auth.ResetPasswordRequest;
import com.roomrentmaharashtra.dto.auth.RegisterRequest;
import com.roomrentmaharashtra.service.AuthService;
import com.roomrentmaharashtra.service.AuthRateLimitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthRateLimitService authRateLimitService;
    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    public AuthController(AuthService authService, AuthRateLimitService authRateLimitService) {
        this.authService = authService;
        this.authRateLimitService = authRateLimitService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        authRateLimitService.check(rateLimitKey(httpRequest, "register", request.email()), 10, Duration.ofMinutes(15));
        AuthResponse response = authService.register(request);
        return authResponseWithCookies(response, httpRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        authRateLimitService.check(rateLimitKey(httpRequest, "login", request.email()), 10, Duration.ofMinutes(15));
        AuthResponse response = authService.login(request);
        return authResponseWithCookies(response, httpRequest);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<GenericMessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        authRateLimitService.check(rateLimitKey(httpRequest, "forgot-password", request.email()), 5, Duration.ofMinutes(15));
        authService.requestPasswordReset(request);
        return ResponseEntity.ok(new GenericMessageResponse("If the email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GenericMessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        authRateLimitService.check(rateLimitKey(httpRequest, "reset-password", request.token()), 10, Duration.ofMinutes(15));
        authService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).body(new GenericMessageResponse("Password updated successfully."));
    }

    @PostMapping("/logout")
    public ResponseEntity<GenericMessageResponse> logout(HttpServletRequest request) {
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, clearCookie("roomrent_token", request).toString())
            .header(HttpHeaders.SET_COOKIE, clearCookie("roomrent_role", request).toString())
            .body(new GenericMessageResponse("Logged out successfully."));
    }

    private ResponseEntity<AuthResponse> authResponseWithCookies(AuthResponse response, HttpServletRequest request) {
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, authCookie(request, "roomrent_token", response.token()).toString())
            .header(HttpHeaders.SET_COOKIE, roleCookie(request, "roomrent_role", response.role().name()).toString())
            .body(response);
    }

    private ResponseCookie authCookie(HttpServletRequest request, String name, String value) {
        boolean secure = isSecureRequest(request);
        return ResponseCookie.from(name, value)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofMillis(jwtExpirationMs))
            .build();
    }

    private ResponseCookie roleCookie(HttpServletRequest request, String name, String value) {
        boolean secure = isSecureRequest(request);
        return ResponseCookie.from(name, value)
            .httpOnly(false)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ofMillis(jwtExpirationMs))
            .build();
    }

    private ResponseCookie clearCookie(String name, HttpServletRequest request) {
        boolean secure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        return ResponseCookie.from(name, "")
            .httpOnly("roomrent_token".equals(name))
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(Duration.ZERO)
            .build();
    }

    private boolean isSecureRequest(HttpServletRequest request) {
        return request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
    }

    private String rateLimitKey(HttpServletRequest request, String action, String value) {
        String ip = request.getRemoteAddr();
        String normalized = value == null ? "" : value.trim().toLowerCase();
        return action + ":" + ip + ":" + normalized;
    }
}
