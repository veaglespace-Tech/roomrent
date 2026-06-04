package com.roomrentmaharashtra.dto.property;

public record AdminDashboardResponse(
    long totalUsers,
    long totalSubscribers,
    long totalProperties,
    long totalEnquiries
) {
}
