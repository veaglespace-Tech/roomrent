package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.user.SubscriptionRequest;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.service.PropertyService;
import com.roomrentmaharashtra.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final PropertyService propertyService;

    public UserController(UserService userService, PropertyService propertyService) {
        this.userService = userService;
        this.propertyService = propertyService;
    }

    @GetMapping("/users/me")
    public Map<String, Object> getProfile(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return profileResponse(user);
    }

    @PostMapping("/users/subscription")
    public Map<String, Object> activateSubscription(@Valid @RequestBody SubscriptionRequest request,
                                                    Authentication authentication) {
        User user = userService.activateSubscription(authentication, request.plan());
        return profileResponse(user);
    }

    private Map<String, Object> profileResponse(User user) {
        Map<String, Object> body = new HashMap<>();
        body.put("id", user.getId());
        body.put("name", user.getName());
        body.put("phone", user.getPhone());
        body.put("email", user.getEmail());
        body.put("role", user.getRole());
        body.put("isSuperAdmin", user.getRole() == Role.ADMIN);
        body.put("subscriptionPlan", user.getSubscriptionPlan());
        body.put("subscriptionActive", userService.hasActiveListingPlan(user));
        body.put("subscriptionExpiresAt", user.getSubscriptionExpiresAt());
        body.put("createdAt", user.getCreatedAt());
        return body;
    }

    @GetMapping("/owner/properties")
    public Object getOwnerProperties(Authentication authentication) {
        return propertyService.getOwnerListings(authentication);
    }

    @GetMapping("/admin/dashboard")
    public Object getAdminDashboard() {
        return propertyService.getAdminDashboard();
    }

    @GetMapping("/admin/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/admin/properties")
    public Object getAdminProperties(Authentication authentication) {
        return propertyService.getAllAdminProperties(authentication);
    }
}
