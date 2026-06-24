package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.auth.GenericMessageResponse;
import com.roomrentmaharashtra.dto.user.PasswordUpdateRequest;
import com.roomrentmaharashtra.dto.user.ProfileUpdateRequest;
import com.roomrentmaharashtra.dto.user.SubscriptionRequest;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.service.PropertyService;
import com.roomrentmaharashtra.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/users/profile")
    public Map<String, Object> updateProfile(@Valid @RequestBody ProfileUpdateRequest request,
                                            Authentication authentication) {
        User updated = userService.updateProfile(authentication, request);
        return profileResponse(updated);
    }

    @PutMapping("/users/password")
    public ResponseEntity<GenericMessageResponse> updatePassword(@Valid @RequestBody PasswordUpdateRequest request,
                                                                 Authentication authentication) {
        userService.updatePassword(authentication, request);
        return ResponseEntity.ok(new GenericMessageResponse("Password updated successfully"));
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

    @PutMapping("/admin/users/{id}")
    public Map<String, Object> updateUserByAdmin(@PathVariable Long id,
                                                 @Valid @RequestBody ProfileUpdateRequest request,
                                                 @RequestParam(required = false) String role) {
        User updated = userService.updateUserByAdmin(id, request, role);
        return profileResponse(updated);
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<GenericMessageResponse> deleteUserByAdmin(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new GenericMessageResponse("User deleted successfully"));
    }

    @GetMapping("/admin/properties")
    public Object getAdminProperties(Authentication authentication) {
        return propertyService.getAllAdminProperties(authentication);
    }
}
