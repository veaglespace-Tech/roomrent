package com.roomrentmaharashtra.dto.property;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.PropertyType;

import java.math.BigDecimal;
import java.util.List;

public record PropertyFilterRequest(
    String location,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    PropertyType type,
    GenderPreference gender,
    String furnishedStatus,
    String sharingType,
    String listedByType,
    List<String> amenities
) {
}
