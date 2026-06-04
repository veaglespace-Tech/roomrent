package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.auth.AuthResponse;
import com.roomrentmaharashtra.dto.auth.ForgotPasswordRequest;
import com.roomrentmaharashtra.dto.auth.LoginRequest;
import com.roomrentmaharashtra.dto.auth.GenericMessageResponse;
import com.roomrentmaharashtra.dto.auth.ResetPasswordRequest;
import com.roomrentmaharashtra.dto.auth.RegisterRequest;
import com.roomrentmaharashtra.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<GenericMessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request);
        return ResponseEntity.ok(new GenericMessageResponse("If the email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GenericMessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).body(new GenericMessageResponse("Password updated successfully."));
    }
}
