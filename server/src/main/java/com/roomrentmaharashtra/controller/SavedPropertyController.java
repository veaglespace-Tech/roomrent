package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.dto.saved.SavedPropertyRequest;
import com.roomrentmaharashtra.dto.saved.SavedPropertyResponse;
import com.roomrentmaharashtra.service.SavedPropertyService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SavedPropertyController {

    private final SavedPropertyService savedPropertyService;

    public SavedPropertyController(SavedPropertyService savedPropertyService) {
        this.savedPropertyService = savedPropertyService;
    }

    @PostMapping("/save")
    public SavedPropertyResponse toggleSaved(@Valid @RequestBody SavedPropertyRequest request,
                                             Authentication authentication) {
        return savedPropertyService.toggleSaved(request, authentication);
    }

    @GetMapping("/saved")
    public List<PropertyResponse> getSaved(Authentication authentication) {
        return savedPropertyService.getSavedProperties(authentication);
    }
}

