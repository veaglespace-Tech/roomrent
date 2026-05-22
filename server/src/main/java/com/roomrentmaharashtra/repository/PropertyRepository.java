package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.PropertyType;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByCreatedBy(User createdBy);
    long countByCreatedBy(User createdBy);
    long countByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    long countByType(PropertyType type);
    long countByGender(GenderPreference gender);
}

