package com.roomrentmaharashtra.dto.property;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequest(
    @NotBlank @Size(max = 180) String title,
    @NotBlank String description,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotBlank @Size(max = 180) String location,
    @NotNull PropertyType type,
    @NotNull GenderPreference gender,
    @NotEmpty List<@NotBlank String> amenities,
    @NotEmpty List<@NotBlank String> imageUrls
) {
}
