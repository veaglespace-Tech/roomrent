package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.SavedSearchAlert;
import com.roomrentmaharashtra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedSearchAlertRepository extends JpaRepository<SavedSearchAlert, Long> {
    List<SavedSearchAlert> findByUserOrderByCreatedAtDesc(User user);
    void deleteByIdAndUser(Long id, User user);
}
