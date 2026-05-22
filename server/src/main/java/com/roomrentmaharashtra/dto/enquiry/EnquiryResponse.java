package com.roomrentmaharashtra.dto.enquiry;

import java.time.LocalDateTime;

public record EnquiryResponse(
    Long id,
    Long propertyId,
    String propertyTitle,
    String userName,
    String userEmail,
    String message,
    LocalDateTime createdAt
) {
}

