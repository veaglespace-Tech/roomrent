package com.roomrentmaharashtra.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordUpdateRequest(
    @NotBlank String oldPassword,
    @NotBlank @Size(min = 6, max = 100, message = "New password must be at least 6 characters") String newPassword
) {
}
