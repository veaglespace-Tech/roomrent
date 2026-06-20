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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public Page<PropertyResponse> getProperties(@RequestParam(required = false) String location,
                                                @RequestParam(required = false) BigDecimal minPrice,
                                                @RequestParam(required = false) BigDecimal maxPrice,
                                                @RequestParam(required = false) com.roomrentmaharashtra.entity.PropertyType type,
                                                @RequestParam(required = false) com.roomrentmaharashtra.entity.GenderPreference gender,
                                                @RequestParam(required = false) String furnishedStatus,
                                                @RequestParam(required = false) String sharingType,
                                                @RequestParam(required = false) String listedByType,
                                                @RequestParam(required = false) String amenities,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "24") int size,
                                                @RequestParam(defaultValue = "newest") String sortBy,
                                                Authentication authentication) {
        
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return propertyService.getProperties(
            new PropertyFilterRequest(
                location,
                minPrice,
                maxPrice,
                type,
                gender,
                furnishedStatus,
                sharingType,
                listedByType,
                amenities == null || amenities.isBlank()
                    ? List.of()
                    : Arrays.stream(amenities.split(",")).map(String::trim).filter(value -> !value.isBlank()).toList()
            ),
            pageable,
            authentication
        );
    }
    
    @GetMapping("/suggestions")
    public List<String> getSuggestions(@RequestParam String q) {
        // Return an empty list for now since suggestions are handled purely on the client side 
        // with the hardcoded static maharashtra-data.
        // We add this endpoint to satisfy the requirements for Phase 3 API contract.
        return List.of();
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
