package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.service.ModerationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/moderation")
public class ModerationController {

    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @GetMapping("/queue")
    public List<PropertyResponse> getReviewQueue(Authentication authentication) {
        return moderationService.getReviewQueue(authentication);
    }

    @PostMapping("/properties/{id}/approve")
    public PropertyResponse approveProperty(@PathVariable Long id, Authentication authentication) {
        return moderationService.approveProperty(id, authentication);
    }

    @PostMapping("/properties/{id}/reject")
    public PropertyResponse rejectProperty(@PathVariable Long id, Authentication authentication) {
        return moderationService.rejectProperty(id, authentication);
    }
}
