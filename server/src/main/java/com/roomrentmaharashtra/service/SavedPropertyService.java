package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.dto.saved.SavedPropertyRequest;
import com.roomrentmaharashtra.dto.saved.SavedPropertyResponse;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.SavedProperty;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.PropertyRepository;
import com.roomrentmaharashtra.repository.SavedPropertyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedPropertyService {

    private final SavedPropertyRepository savedPropertyRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyService propertyService;

    public SavedPropertyService(SavedPropertyRepository savedPropertyRepository,
                                PropertyRepository propertyRepository,
                                UserService userService,
                                PropertyService propertyService) {
        this.savedPropertyRepository = savedPropertyRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    public SavedPropertyResponse toggleSaved(SavedPropertyRequest request, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(request.propertyId())
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        return savedPropertyRepository.findByUserAndProperty(user, property)
            .map(savedProperty -> {
                savedPropertyRepository.delete(savedProperty);
                return new SavedPropertyResponse(false, "Property removed from saved list");
            })
            .orElseGet(() -> {
                SavedProperty savedProperty = new SavedProperty();
                savedProperty.setUser(user);
                savedProperty.setProperty(property);
                savedPropertyRepository.save(savedProperty);
                return new SavedPropertyResponse(true, "Property saved");
            });
    }

    public List<PropertyResponse> getSavedProperties(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return savedPropertyRepository.findByUser(user).stream()
            .map(SavedProperty::getProperty)
            .map(property -> propertyService.getPropertyById(property.getId(), authentication))
            .toList();
    }
}

