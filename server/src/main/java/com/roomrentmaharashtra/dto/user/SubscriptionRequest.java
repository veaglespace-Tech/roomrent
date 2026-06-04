package com.roomrentmaharashtra.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SubscriptionRequest(
    @NotBlank
    @Pattern(regexp = "STARTER|PRO|BUSINESS", message = "Plan must be STARTER, PRO, or BUSINESS")
    String plan
) {
}
