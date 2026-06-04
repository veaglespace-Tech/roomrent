package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.searchalert.SavedSearchRequest;
import com.roomrentmaharashtra.dto.searchalert.SavedSearchResponse;
import com.roomrentmaharashtra.service.SavedSearchAlertService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/saved-searches")
public class SavedSearchAlertController {

    private final SavedSearchAlertService savedSearchAlertService;

    public SavedSearchAlertController(SavedSearchAlertService savedSearchAlertService) {
        this.savedSearchAlertService = savedSearchAlertService;
    }

    @GetMapping
    public List<SavedSearchResponse> getAlerts(Authentication authentication) {
        return savedSearchAlertService.getAlerts(authentication);
    }

    @PostMapping
    public SavedSearchResponse createAlert(@Valid @RequestBody SavedSearchRequest request,
                                           Authentication authentication) {
        return savedSearchAlertService.createAlert(request, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id, Authentication authentication) {
        savedSearchAlertService.deleteAlert(id, authentication);
    }
}
