package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.user.PasswordUpdateRequest;
import com.roomrentmaharashtra.dto.user.ProfileUpdateRequest;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.UserRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, 
                       PropertyRepository propertyRepository,
                       @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.passwordEncoder = passwordEncoder;
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

    public User updateProfile(Authentication authentication, ProfileUpdateRequest request) {
        User user = getCurrentUser(authentication);
        
        String cleanEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (!user.getEmail().equalsIgnoreCase(cleanEmail)) {
            if (userRepository.findByEmailIgnoreCase(cleanEmail).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(cleanEmail);
        }
        
        user.setName(request.name().trim());
        user.setPhone(request.phone() == null ? null : request.phone().trim());
        return userRepository.save(user);
    }

    public void updatePassword(Authentication authentication, PasswordUpdateRequest request) {
        User user = getCurrentUser(authentication);
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Remove properties created by this user first
        List<Property> properties = propertyRepository.findByCreatedBy(user);
        propertyRepository.deleteAll(properties);

        userRepository.delete(user);
    }

    public User updateUserByAdmin(Long userId, ProfileUpdateRequest request, String role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String cleanEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (!user.getEmail().equalsIgnoreCase(cleanEmail)) {
            if (userRepository.findByEmailIgnoreCase(cleanEmail).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(cleanEmail);
        }

        user.setName(request.name().trim());
        user.setPhone(request.phone() == null ? null : request.phone().trim());
        
        if (role != null) {
            user.setRole(Role.valueOf(role.trim().toUpperCase(Locale.ROOT)));
        }

        return userRepository.save(user);
    }
}
