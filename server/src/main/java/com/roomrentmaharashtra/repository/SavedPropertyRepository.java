package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.SavedProperty;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {
    List<SavedProperty> findByUser(User user);
    Optional<SavedProperty> findByUserAndProperty(User user, Property property);
}

