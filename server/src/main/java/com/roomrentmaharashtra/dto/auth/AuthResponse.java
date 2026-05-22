package com.roomrentmaharashtra.dto.auth;

import com.roomrentmaharashtra.entity.Role;

public record AuthResponse(
    String token,
    Long id,
    String name,
    String email,
    Role role
) {
}

