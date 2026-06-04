package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.auth.AuthResponse;
import com.roomrentmaharashtra.dto.auth.ForgotPasswordRequest;
import com.roomrentmaharashtra.dto.auth.LoginRequest;
import com.roomrentmaharashtra.dto.auth.ResetPasswordRequest;
import com.roomrentmaharashtra.dto.auth.RegisterRequest;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.PasswordResetToken;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.PasswordResetTokenRepository;
import com.roomrentmaharashtra.repository.UserRepository;
import com.roomrentmaharashtra.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MailService mailService;

    public AuthService(UserRepository userRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       MailService mailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role requestedRole = request.role() == null ? Role.USER : request.role();
        if (requestedRole != Role.USER && requestedRole != Role.OWNER) {
            throw new IllegalArgumentException("Role must be USER or OWNER");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setPhone(request.phone().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(requestedRole);

        User savedUser = userRepository.save(user);
        mailService.sendWelcomeMail(savedUser);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        return toAuthResponse(token, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return toAuthResponse(token, user);
    }

    public void requestPasswordReset(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUser(user);

            PasswordResetToken token = new PasswordResetToken();
            token.setUser(user);
            token.setToken(UUID.randomUUID().toString().replace("-", ""));
            token.setExpiresAt(LocalDateTime.now().plusMinutes(30));
            passwordResetTokenRepository.save(token);

            mailService.sendPasswordResetMail(user, token.getToken());
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.token().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Reset token not found"));

        if (token.getUsedAt() != null) {
            throw new IllegalArgumentException("Reset token has already been used");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(token);
    }

    private AuthResponse toAuthResponse(String token, User user) {
        return new AuthResponse(
            token,
            user.getId(),
            user.getName(),
            user.getPhone(),
            user.getEmail(),
            user.getRole(),
            user.getSubscriptionPlan(),
            hasActiveListingPlan(user),
            user.getSubscriptionExpiresAt()
        );
    }

    private boolean hasActiveListingPlan(User user) {
        if (user.getRole() == Role.ADMIN) {
            return true;
        }

        if (!user.isSubscriptionActive()) {
            return false;
        }

        return user.getSubscriptionExpiresAt() == null || user.getSubscriptionExpiresAt().isAfter(LocalDateTime.now());
    }
}
