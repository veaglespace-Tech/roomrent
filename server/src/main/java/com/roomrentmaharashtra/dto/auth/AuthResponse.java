package com.roomrentmaharashtra.dto.auth;

import com.roomrentmaharashtra.entity.Role;

import java.time.LocalDateTime;

public record AuthResponse(
    String token,
    Long id,
    String name,
    String phone,
    String email,
    Role role,
    String subscriptionPlan,
    boolean subscriptionActive,
    LocalDateTime subscriptionExpiresAt
) {
}
