package com.roomrentmaharashtra.dto.lead;

import jakarta.validation.constraints.NotNull;

public record LeadRequest(
    @NotNull Long propertyId
) {
}
