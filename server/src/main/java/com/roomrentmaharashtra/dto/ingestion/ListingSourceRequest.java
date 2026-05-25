package com.roomrentmaharashtra.dto.ingestion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ListingSourceRequest(
    @NotBlank @Size(max = 180) String sourceName,
    @NotBlank @Size(max = 255) String sourceDomain,
    boolean allowedForIngestion,
    @NotBlank @Size(max = 40) String termsStatus,
    String notes
) {
}
