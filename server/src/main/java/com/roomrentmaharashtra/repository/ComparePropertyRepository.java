package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.CompareProperty;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComparePropertyRepository extends JpaRepository<CompareProperty, Long> {
    List<CompareProperty> findByUserOrderByCreatedAtAsc(User user);
    Optional<CompareProperty> findByUserAndProperty(User user, Property property);
    void deleteByUser(User user);
    void deleteByUserAndProperty(User user, Property property);
}
