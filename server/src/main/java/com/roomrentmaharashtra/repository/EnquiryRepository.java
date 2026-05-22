package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.Enquiry;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByUser(User user);
    List<Enquiry> findByPropertyCreatedByOrderByCreatedAtDesc(User owner);
}

