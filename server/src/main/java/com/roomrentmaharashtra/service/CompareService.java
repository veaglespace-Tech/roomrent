package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.compare.CompareToggleResponse;
import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.entity.CompareProperty;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.ComparePropertyRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompareService {

    private final ComparePropertyRepository comparePropertyRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final PropertyService propertyService;

    public CompareService(ComparePropertyRepository comparePropertyRepository,
                          PropertyRepository propertyRepository,
                          UserService userService,
                          PropertyService propertyService) {
        this.comparePropertyRepository = comparePropertyRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    public List<PropertyResponse> getComparedProperties(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return comparePropertyRepository.findByUserOrderByCreatedAtAsc(user).stream()
            .map(CompareProperty::getProperty)
            .map(property -> propertyService.getPropertyById(property.getId(), authentication))
            .toList();
    }

    public CompareToggleResponse toggleCompare(Long propertyId, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        return comparePropertyRepository.findByUserAndProperty(user, property)
            .map(existing -> {
                comparePropertyRepository.delete(existing);
                int count = comparePropertyRepository.findByUserOrderByCreatedAtAsc(user).size();
                return new CompareToggleResponse(false, count);
            })
            .orElseGet(() -> {
                int count = comparePropertyRepository.findByUserOrderByCreatedAtAsc(user).size();
                if (count >= 3) {
                    throw new IllegalArgumentException("You can compare up to 3 properties only");
                }

                CompareProperty compareProperty = new CompareProperty();
                compareProperty.setUser(user);
                compareProperty.setProperty(property);
                comparePropertyRepository.save(compareProperty);
                return new CompareToggleResponse(true, comparePropertyRepository.findByUserOrderByCreatedAtAsc(user).size());
            });
    }

    public void removeCompare(Long propertyId, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        comparePropertyRepository.deleteByUserAndProperty(user, property);
    }

    public void clearCompare(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        comparePropertyRepository.deleteByUser(user);
    }
}
