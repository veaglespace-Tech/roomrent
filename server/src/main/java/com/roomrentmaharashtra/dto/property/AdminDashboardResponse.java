package com.roomrentmaharashtra.dto.property;

public record AdminDashboardResponse(
    long totalUsers,
    long totalOwners,
    long totalProperties,
    long totalEnquiries
) {
}

