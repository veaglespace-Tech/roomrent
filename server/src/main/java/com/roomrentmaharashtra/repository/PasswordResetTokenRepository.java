package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.PasswordResetToken;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
