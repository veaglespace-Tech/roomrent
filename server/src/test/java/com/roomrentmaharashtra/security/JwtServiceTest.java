package com.roomrentmaharashtra.security;

import com.roomrentmaharashtra.entity.Role;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void generatesAndValidatesToken() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "0123456789abcdef0123456789abcdef");
        ReflectionTestUtils.setField(jwtService, "expirationMs", 86400000L);

        String token = jwtService.generateToken("owner@example.com", Role.OWNER.name());
        UserDetails userDetails = User.withUsername("owner@example.com").password("secret").authorities("ROLE_OWNER").build();

        assertEquals("owner@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }
}
