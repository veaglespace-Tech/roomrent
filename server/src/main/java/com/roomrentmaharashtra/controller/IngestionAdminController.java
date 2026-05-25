package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.ingestion.IngestionRunRequest;
import com.roomrentmaharashtra.dto.ingestion.IngestionRunResponse;
import com.roomrentmaharashtra.dto.ingestion.ListingSourceRequest;
import com.roomrentmaharashtra.dto.ingestion.ListingSourceResponse;
import com.roomrentmaharashtra.service.IngestionAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class IngestionAdminController {

    private final IngestionAdminService ingestionAdminService;

    public IngestionAdminController(IngestionAdminService ingestionAdminService) {
        this.ingestionAdminService = ingestionAdminService;
    }

    @GetMapping("/sources")
    public List<ListingSourceResponse> getSources() {
        return ingestionAdminService.getSources();
    }

    @PostMapping("/sources")
    public ListingSourceResponse createSource(@Valid @RequestBody ListingSourceRequest request) {
        return ingestionAdminService.createSource(request);
    }

    @GetMapping("/ingestion-runs")
    public List<IngestionRunResponse> getRuns() {
        return ingestionAdminService.getRuns();
    }

    @PostMapping("/ingestion-runs")
    public IngestionRunResponse enqueueRun(@Valid @RequestBody IngestionRunRequest request) {
        return ingestionAdminService.enqueueRun(request);
    }
}
