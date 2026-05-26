package com.roomrentmaharashtra.service;

import org.springframework.stereotype.Service;

@Service
public class IngestionWorkerService {

    public void enqueue(Long runId) {
        // Worker stub for compliant source ingestion.
        // Future implementation should fetch, parse, normalize, and stage records.
    }
}
