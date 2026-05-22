package com.roomrentmaharashtra.dto.saved;

import jakarta.validation.constraints.NotNull;

public record SavedPropertyRequest(@NotNull Long propertyId) {
}

