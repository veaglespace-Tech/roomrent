package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.compare.CompareToggleResponse;
import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.service.CompareService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/compare")
public class CompareController {

    private final CompareService compareService;

    public CompareController(CompareService compareService) {
        this.compareService = compareService;
    }

    @GetMapping
    public List<PropertyResponse> getCompareList(Authentication authentication) {
        return compareService.getComparedProperties(authentication);
    }

    @PostMapping("/{propertyId}")
    public CompareToggleResponse toggleCompare(@PathVariable Long propertyId, Authentication authentication) {
        return compareService.toggleCompare(propertyId, authentication);
    }

    @DeleteMapping("/{propertyId}")
    public void removeCompare(@PathVariable Long propertyId, Authentication authentication) {
        compareService.removeCompare(propertyId, authentication);
    }

    @DeleteMapping
    public void clearCompare(Authentication authentication) {
        compareService.clearCompare(authentication);
    }
}
