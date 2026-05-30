package com.roomrentmaharashtra.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
    @NotBlank @Email @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.com$", message = "Email must end with .com") String email,
    @NotBlank String password
) {
}
