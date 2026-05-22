package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
