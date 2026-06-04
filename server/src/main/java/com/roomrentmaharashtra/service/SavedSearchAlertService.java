package com.roomrentmaharashtra.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roomrentmaharashtra.dto.property.PropertyFilterRequest;
import com.roomrentmaharashtra.dto.searchalert.SavedSearchRequest;
import com.roomrentmaharashtra.dto.searchalert.SavedSearchResponse;
import com.roomrentmaharashtra.entity.SavedSearchAlert;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.repository.SavedSearchAlertRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedSearchAlertService {

    private final SavedSearchAlertRepository savedSearchAlertRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public SavedSearchAlertService(SavedSearchAlertRepository savedSearchAlertRepository,
                                   UserService userService,
                                   ObjectMapper objectMapper) {
        this.savedSearchAlertRepository = savedSearchAlertRepository;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public List<SavedSearchResponse> getAlerts(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return savedSearchAlertRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .map(this::toResponse)
            .toList();
    }

    public SavedSearchResponse createAlert(SavedSearchRequest request, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        SavedSearchAlert alert = new SavedSearchAlert();
        alert.setUser(user);
        alert.setLabel(request.label().trim());
        alert.setFiltersJson(writeFilters(request.filters()));
        return toResponse(savedSearchAlertRepository.save(alert));
    }

    public void deleteAlert(Long id, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        savedSearchAlertRepository.deleteByIdAndUser(id, user);
    }

    private SavedSearchResponse toResponse(SavedSearchAlert alert) {
        return new SavedSearchResponse(
            alert.getId(),
            alert.getLabel(),
            readFilters(alert.getFiltersJson()),
            alert.getCreatedAt()
        );
    }

    private String writeFilters(PropertyFilterRequest filters) {
        try {
            return objectMapper.writeValueAsString(filters);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to save search filters", e);
        }
    }

    private PropertyFilterRequest readFilters(String json) {
        try {
            return objectMapper.readValue(json, PropertyFilterRequest.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to read saved search filters", e);
        }
    }
}
