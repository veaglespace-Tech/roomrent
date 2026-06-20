package com.roomrentmaharashtra.dto.auth;

import com.roomrentmaharashtra.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 120, message = "Name must be at least 3 characters")
    String name,
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10 digit Indian mobile number") String phone,
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 180, message = "Email must be 180 characters or less")
    String email,
    @NotBlank
    @Size(min = 8, max = 72, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
        message = "Password must include uppercase, lowercase, number and special character"
    )
    String password,
    Role role
) {
}
