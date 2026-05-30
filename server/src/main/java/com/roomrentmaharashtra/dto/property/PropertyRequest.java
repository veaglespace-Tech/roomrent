package com.roomrentmaharashtra.dto.property;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequest(
    @NotBlank @Size(max = 180) String title,
    @NotBlank String description,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @DecimalMin("0.0") BigDecimal securityDeposit,
    @NotBlank @Size(max = 180) String location,
    @Size(max = 160) String areaLocality,
    @Size(max = 120) String city,
    @Size(max = 120) String district,
    @Size(max = 120) String state,
    @Size(max = 80) String category,
    @Size(max = 60) String sharingType,
    @Size(max = 40) String furnishedStatus,
    @Size(max = 40) String listedByType,
    @Size(max = 30) @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Contact number must be a valid 10 digit Indian mobile number") String contactNumber,
    BigDecimal latitude,
    BigDecimal longitude,
    @Size(max = 40) String availabilityStatus,
    @Size(max = 30) String availableFromDate,
    @Size(max = 160) String occupancyDetails,
    @Size(max = 180) String listingSource,
    @Size(max = 500) String listingUrl,
    @NotNull PropertyType type,
    @NotNull GenderPreference gender,
    @NotEmpty List<@NotBlank String> amenities,
    @NotEmpty List<@NotBlank String> imageUrls
) {
}
