package com.roomrentmaharashtra.dto.auth;

import com.roomrentmaharashtra.entity.Role;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthRequestValidationTest {

    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void registerRequestEnforcesStrongValidation() {
        Set<String> messages = VALIDATOR.validate(new RegisterRequest("Jo", "123", "bad-email", "weak", Role.USER))
            .stream()
            .map(violation -> violation.getPropertyPath() + ":" + violation.getMessage())
            .collect(Collectors.toSet());

        assertTrue(messages.stream().anyMatch(message -> message.contains("name") && message.contains("at least 3 characters")));
        assertTrue(messages.stream().anyMatch(message -> message.contains("phone") && message.contains("valid 10 digit")));
        assertTrue(messages.stream().anyMatch(message -> message.contains("email") && message.contains("valid email address")));
        assertTrue(messages.stream().anyMatch(message -> message.contains("password")));
    }

    @Test
    void loginRequestRequiresEmailAndPassword() {
        Set<String> messages = VALIDATOR.validate(new LoginRequest(" ", " "))
            .stream()
            .map(violation -> violation.getPropertyPath() + ":" + violation.getMessage())
            .collect(Collectors.toSet());

        assertTrue(messages.stream().anyMatch(message -> message.contains("email") && message.contains("Email is required")));
        assertTrue(messages.stream().anyMatch(message -> message.contains("password") && message.contains("Password is required")));
    }
}
