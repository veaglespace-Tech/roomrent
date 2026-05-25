package com.roomrentmaharashtra.repository;

import com.roomrentmaharashtra.entity.IngestionRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngestionRunRepository extends JpaRepository<IngestionRun, Long> {
    List<IngestionRun> findTop20ByOrderByStartedAtDesc();
}
