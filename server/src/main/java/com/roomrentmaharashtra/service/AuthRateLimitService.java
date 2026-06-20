package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthRateLimitService {

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public void check(String key, int maxAttempts, Duration windowDuration) {
        long now = Instant.now().toEpochMilli();
        long windowMs = windowDuration.toMillis();

        windows.compute(key, (currentKey, window) -> {
            if (window == null || now - window.startedAt() >= windowMs) {
                return new Window(now, 1);
            }

            if (window.attempts() >= maxAttempts) {
                throw new RateLimitExceededException("Too many attempts. Please try again later.");
            }

            return new Window(window.startedAt(), window.attempts() + 1);
        });
    }

    private record Window(long startedAt, int attempts) {
    }
}
