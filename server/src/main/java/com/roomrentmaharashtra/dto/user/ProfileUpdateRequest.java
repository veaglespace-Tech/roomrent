package com.roomrentmaharashtra.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
    @NotBlank @Size(min = 2, max = 120) String name,
    @NotBlank @Email @Size(max = 180) String email,
    @Size(max = 30) @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian number") String phone
) {
}
