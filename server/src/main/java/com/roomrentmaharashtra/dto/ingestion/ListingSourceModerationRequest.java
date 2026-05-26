package com.roomrentmaharashtra.dto.ingestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ListingSourceModerationRequest(
    boolean allowedForIngestion,
    @NotBlank @Size(max = 40) String termsStatus,
    String notes
) {
}
