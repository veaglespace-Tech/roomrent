package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.service.PropertyService;
import com.roomrentmaharashtra.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "phone", user.getPhone(),
            "email", user.getEmail(),
            "role", user.getRole(),
            "createdAt", user.getCreatedAt()
        );
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
