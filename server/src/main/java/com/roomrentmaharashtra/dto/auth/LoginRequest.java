package com.roomrentmaharashtra.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank @Email(message = "Email must be a valid address") @Size(max = 180) String email,
    @NotBlank String password
) {
}
