package com.roomrentmaharashtra.dto.ingestion;

public record ListingSourceResponse(
    Long id,
    String sourceName,
    String sourceDomain,
    boolean allowedForIngestion,
    String termsStatus,
    String notes
) {
}
