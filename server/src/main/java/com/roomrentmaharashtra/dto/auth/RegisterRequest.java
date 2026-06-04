package com.roomrentmaharashtra.dto.auth;

import com.roomrentmaharashtra.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(min = 2, max = 120) String name,
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10 digit Indian mobile number") String phone,
    @NotBlank @Email(message = "Email must be a valid address") @Size(max = 180) String email,
    @NotBlank
    @Size(min = 8, max = 72)
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
        message = "Password must include uppercase, lowercase, number and special character"
    )
    String password,
    Role role
) {
}
