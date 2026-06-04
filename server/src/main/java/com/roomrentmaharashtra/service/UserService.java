package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public Optional<User> getCurrentUserOptional(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return Optional.empty();
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public long countUsersByRole(Role role) {
        return userRepository.findAll().stream().filter(user -> user.getRole() == role).count();
    }

    public long countActiveListingPlanUsers() {
        return userRepository.findAll().stream().filter(this::hasActiveListingPlan).count();
    }

    public boolean hasActiveListingPlan(User user) {
        if (user == null) {
            return false;
        }

        if (user.getRole() == Role.ADMIN) {
            return true;
        }

        if (!user.isSubscriptionActive()) {
            return false;
        }

        return user.getSubscriptionExpiresAt() == null || user.getSubscriptionExpiresAt().isAfter(LocalDateTime.now());
    }

    public User activateSubscription(Authentication authentication, String requestedPlan) {
        User user = getCurrentUser(authentication);
        String plan = requestedPlan == null ? "STARTER" : requestedPlan.trim().toUpperCase(Locale.ROOT);

        if (!List.of("STARTER", "PRO", "BUSINESS").contains(plan)) {
            throw new IllegalArgumentException("Plan must be STARTER, PRO, or BUSINESS");
        }

        int durationDays = switch (plan) {
            case "BUSINESS" -> 180;
            case "PRO" -> 90;
            default -> 30;
        };

        LocalDateTime now = LocalDateTime.now();
        user.setSubscriptionPlan(plan);
        user.setSubscriptionActive(true);
        user.setSubscriptionStartedAt(now);
        user.setSubscriptionExpiresAt(now.plusDays(durationDays));
        return userRepository.save(user);
    }
}
