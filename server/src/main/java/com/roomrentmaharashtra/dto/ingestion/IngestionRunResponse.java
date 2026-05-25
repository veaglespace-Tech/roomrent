package com.roomrentmaharashtra.dto.ingestion;

import java.time.LocalDateTime;

public record IngestionRunResponse(
    Long id,
    String sourceName,
    String sourceDomain,
    String status,
    int fetchedCount,
    int parsedCount,
    int publishedCount,
    int errorCount,
    LocalDateTime startedAt,
    LocalDateTime finishedAt,
    String notes
) {
}
