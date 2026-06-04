package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.Lead;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    @EntityGraph(attributePaths = {"property", "user"})
    List<Lead> findByPropertyCreatedByOrderByCreatedAtDesc(User owner);
}
