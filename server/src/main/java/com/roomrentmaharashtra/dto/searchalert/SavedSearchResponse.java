package com.roomrentmaharashtra.dto.searchalert;

import com.roomrentmaharashtra.dto.property.PropertyFilterRequest;

import java.time.LocalDateTime;

public record SavedSearchResponse(
    Long id,
    String label,
    PropertyFilterRequest filters,
    LocalDateTime createdAt
) {
}
