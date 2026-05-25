package com.roomrentmaharashtra.dto.ingestion;

import jakarta.validation.constraints.NotNull;

public record IngestionRunRequest(
    @NotNull Long sourceId,
    String notes
) {
}
