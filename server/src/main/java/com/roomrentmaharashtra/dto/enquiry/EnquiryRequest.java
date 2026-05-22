package com.roomrentmaharashtra.dto.enquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnquiryRequest(
    @NotNull Long propertyId,
    @NotBlank String message
) {
}

