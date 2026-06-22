package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.auth.AuthResponse;
import com.roomrentmaharashtra.dto.auth.LoginRequest;
import com.roomrentmaharashtra.dto.auth.RegisterRequest;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.repository.PasswordResetTokenRepository;
import com.roomrentmaharashtra.repository.UserRepository;
import com.roomrentmaharashtra.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private MailService mailService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmailIgnoreCase("owner@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () ->
            authService.register(new RegisterRequest("Owner User", "9876543210", "owner@example.com", "StrongPass1!", Role.OWNER))
        );
    }

    @Test
    void registerCreatesNormalizedUserAndReturnsAuthResponse() {
        when(userRepository.existsByEmailIgnoreCase("owner@example.com")).thenReturn(false);
        when(passwordEncoder.encode("StrongPass1!")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(42L);
            return saved;
        });
        when(jwtService.generateToken("owner@example.com", "OWNER")).thenReturn("jwt-token");

        AuthResponse response = authService.register(
            new RegisterRequest("Owner User", "9876543210", "OWNER@EXAMPLE.COM", "StrongPass1!", Role.OWNER)
        );

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        verify(mailService).sendWelcomeMail(any(User.class));

        assertEquals("owner@example.com", userCaptor.getValue().getEmail());
        assertEquals("encoded-password", userCaptor.getValue().getPassword());
        assertEquals(Role.OWNER, userCaptor.getValue().getRole());
        assertEquals("jwt-token", response.token());
        assertEquals(Role.OWNER, response.role());
        assertEquals(42L, response.id());
    }

    @Test
    void loginAuthenticatesAndReturnsToken() {
        User user = new User();
        user.setId(7L);
        user.setName("User");
        user.setPhone("9876543210");
        user.setEmail("user@example.com");
        user.setRole(Role.USER);

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("user@example.com", "USER")).thenReturn("login-token");

        AuthResponse response = authService.login(new LoginRequest("USER@EXAMPLE.COM", "Secret123!"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertEquals("login-token", response.token());
        assertEquals(Role.USER, response.role());
        assertEquals("user@example.com", response.email());
    }
}
