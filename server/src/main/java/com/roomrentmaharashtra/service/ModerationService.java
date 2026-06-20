package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.exception.UnauthorizedException;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModerationService {

    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyService propertyService; // to reuse toResponse

    public ModerationService(PropertyRepository propertyRepository, UserService userService, PropertyService propertyService) {
        this.propertyRepository = propertyRepository;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    public List<PropertyResponse> getReviewQueue(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }

        // Fetch properties with PENDING moderation status
        // Doing a simple findAll and filter for now as we don't have a specific repository method yet
        // In a real scenario we'd add findByModerationStatus to PropertyRepository
        return propertyRepository.findAll().stream()
            .filter(p -> "PENDING".equals(p.getModerationStatus()))
            .map(p -> propertyService.getPropertyById(p.getId(), authentication))
            .collect(Collectors.toList());
    }

    public PropertyResponse approveProperty(Long id, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }

        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setModerationStatus("APPROVED");
        if (property.getPublishedAt() == null) {
            property.setPublishedAt(LocalDateTime.now());
        }
        
        propertyRepository.save(property);
        return propertyService.getPropertyById(id, authentication);
    }

    public PropertyResponse rejectProperty(Long id, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }

        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setModerationStatus("REJECTED");
        propertyRepository.save(property);
        return propertyService.getPropertyById(id, authentication);
    }
}
