package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.exception.RateLimitExceededException;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthRateLimitServiceTest {

    @Test
    void allowsRequestsWithinLimitAndBlocksAfterThreshold() {
        AuthRateLimitService service = new AuthRateLimitService();
        String key = "login:127.0.0.1:test@example.com";

        assertDoesNotThrow(() -> {
            service.check(key, 2, Duration.ofMinutes(15));
            service.check(key, 2, Duration.ofMinutes(15));
        });

        assertThrows(RateLimitExceededException.class, () -> service.check(key, 2, Duration.ofMinutes(15)));
    }
}
