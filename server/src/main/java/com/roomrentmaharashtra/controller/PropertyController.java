package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.property.PropertyFilterRequest;
import com.roomrentmaharashtra.dto.property.PropertyRequest;
import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public List<PropertyResponse> getProperties(@RequestParam(required = false) String location,
                                                @RequestParam(required = false) BigDecimal minPrice,
                                                @RequestParam(required = false) BigDecimal maxPrice,
                                                @RequestParam(required = false) com.roomrentmaharashtra.entity.PropertyType type,
                                                @RequestParam(required = false) com.roomrentmaharashtra.entity.GenderPreference gender,
                                                @RequestParam(required = false) String amenities,
                                                Authentication authentication) {
        return propertyService.getProperties(
            new PropertyFilterRequest(
                location,
                minPrice,
                maxPrice,
                type,
                gender,
                amenities == null || amenities.isBlank()
                    ? List.of()
                    : Arrays.stream(amenities.split(",")).map(String::trim).filter(value -> !value.isBlank()).toList()
            ),
            authentication
        );
    }

    @GetMapping("/{id}")
    public PropertyResponse getProperty(@PathVariable Long id, Authentication authentication) {
        return propertyService.getPropertyById(id, authentication);
    }

    @PostMapping
    public PropertyResponse createProperty(@Valid @RequestBody PropertyRequest request, Authentication authentication) {
        return propertyService.createProperty(request, authentication);
    }

    @PutMapping("/{id}")
    public PropertyResponse updateProperty(@PathVariable Long id,
                                           @Valid @RequestBody PropertyRequest request,
                                           Authentication authentication) {
        return propertyService.updateProperty(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id, Authentication authentication) {
        propertyService.deleteProperty(id, authentication);
    }
}
