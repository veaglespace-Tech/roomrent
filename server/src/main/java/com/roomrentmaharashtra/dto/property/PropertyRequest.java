package com.roomrentmaharashtra.dto.property;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequest(
    @NotBlank @Size(min = 5, max = 180) String title,
    @NotBlank @Size(min = 20, max = 5000) String description,
    @NotNull @DecimalMin(value = "1.0", message = "Monthly rent must be greater than 0") BigDecimal price,
    @DecimalMin("0.0") BigDecimal securityDeposit,
    @NotBlank @Size(max = 180) String location,
    @Size(max = 160) String areaLocality,
    @NotBlank @Size(max = 120) String city,
    @NotBlank @Size(max = 120) String district,
    @NotBlank @Size(max = 120) String state,
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
    @Size(max = 500) @Pattern(regexp = "^$|https?://.+", message = "Listing URL must start with http:// or https://") String listingUrl,
    @NotNull PropertyType type,
    @NotNull GenderPreference gender,
    @NotEmpty @Size(max = 20) List<@NotBlank @Size(max = 120) String> amenities,
    @NotEmpty @Size(max = 12) List<@NotBlank @URL(message = "Each image URL must be valid") String> imageUrls
) {
}
