package com.roomrentmaharashtra.dto.lead;

import java.time.LocalDateTime;

public record LeadResponse(
    Long id,
    Long propertyId,
    String propertyTitle,
    String contactName,
    String contactPhone,
    LocalDateTime createdAt
) {
}
