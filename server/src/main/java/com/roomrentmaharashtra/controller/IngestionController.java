package com.roomrentmaharashtra.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.roomrentmaharashtra.exception.UnauthorizedException;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/ingest")
public class IngestionController {

    private final UserService userService;

    public IngestionController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public Map<String, Object> triggerIngestion(@RequestBody Map<String, Object> payload, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }

        String source = (String) payload.getOrDefault("source", "unknown");
        int limit = (Integer) payload.getOrDefault("limit", 100);

        // Stub implementation for ingestion pipeline
        System.out.println("Triggered ingestion for source: " + source + " with limit: " + limit);

        return Map.of(
            "status", "QUEUED",
            "source", source,
            "limit", limit,
            "message", "Ingestion job queued successfully."
        );
    }
}
