package com.roomrentmaharashtra.dto.property;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PropertyResponse(
    Long id,
    String title,
    String description,
    BigDecimal price,
    BigDecimal securityDeposit,
    String location,
    String areaLocality,
    String city,
    String district,
    String state,
    String category,
    String sharingType,
    String furnishedStatus,
    String listedByType,
    String contactNumber,
    BigDecimal latitude,
    BigDecimal longitude,
    String availabilityStatus,
    String availableFromDate,
    String occupancyDetails,
    String listingSource,
    String listingUrl,
    PropertyType type,
    GenderPreference gender,
    List<String> amenities,
    List<String> imageUrls,
    OwnerSummary owner,
    boolean saved,
    LocalDateTime createdAt,
    String moderationStatus,
    LocalDateTime publishedAt
) {
    public record OwnerSummary(Long id, String name, String email) {
    }
}
