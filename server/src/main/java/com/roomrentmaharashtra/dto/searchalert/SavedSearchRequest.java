package com.roomrentmaharashtra.dto.searchalert;

import com.roomrentmaharashtra.dto.property.PropertyFilterRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SavedSearchRequest(
    @NotBlank String label,
    @Valid @NotNull PropertyFilterRequest filters
) {
}
