package com.roomrentmaharashtra.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 180, message = "Email must be 180 characters or less")
    String email,
    @NotBlank(message = "Password is required")
    String password
) {
}
