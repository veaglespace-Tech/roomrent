package com.roomrentmaharashtra.service;

import org.springframework.stereotype.Service;

@Service
public class DedupeJobService {

    public void scheduleForRun(Long runId) {
        // Dedupe stub for ingestion pipeline.
        // Future implementation should fingerprint staged records and flag duplicates.
    }
}
