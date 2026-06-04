package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.entity.IngestionRun;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.IngestionRunRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DedupeJobService {

    private final IngestionRunRepository ingestionRunRepository;
    private final PropertyRepository propertyRepository;

    public DedupeJobService(IngestionRunRepository ingestionRunRepository,
                            PropertyRepository propertyRepository) {
        this.ingestionRunRepository = ingestionRunRepository;
        this.propertyRepository = propertyRepository;
    }

    public IngestionRun scheduleForRun(Long runId) {
        IngestionRun run = ingestionRunRepository.findById(runId)
            .orElseThrow(() -> new ResourceNotFoundException("Ingestion run not found"));

        if ("BLOCKED".equalsIgnoreCase(run.getStatus()) || "FAILED".equalsIgnoreCase(run.getStatus())) {
            run.setNotes(appendNote(run.getNotes(), "Dedupe skipped because the ingestion run did not complete."));
            return ingestionRunRepository.save(run);
        }

        List<Property> listings = propertyRepository.findAll();
        Map<String, Long> fingerprintCounts = listings.stream()
            .collect(Collectors.groupingBy(this::fingerprint, LinkedHashMap::new, Collectors.counting()));

        long duplicateGroups = fingerprintCounts.values().stream().filter(count -> count > 1).count();
        long duplicateListings = fingerprintCounts.values().stream()
            .filter(count -> count > 1)
            .mapToLong(count -> count - 1)
            .sum();

        String nextStatus = duplicateListings > 0 ? "REVIEW_REQUIRED" : "COMPLETED";
        String note = duplicateListings > 0
            ? "Dedupe scan found " + duplicateGroups + " duplicate groups covering " + duplicateListings + " extra listings."
            : "Dedupe scan completed with no duplicate groups detected.";

        run.setStatus(nextStatus);
        run.setNotes(appendNote(run.getNotes(), note));
        run.setFinishedAt(LocalDateTime.now());
        return ingestionRunRepository.save(run);
    }

    private String fingerprint(Property property) {
        return String.join("|",
            normalize(property.getTitle()),
            normalize(property.getLocation()),
            normalize(property.getAreaLocality()),
            normalize(property.getCity()),
            normalize(property.getDistrict()),
            normalize(property.getState()),
            normalize(property.getContactNumber()),
            property.getPrice() == null ? "" : property.getPrice().stripTrailingZeros().toPlainString(),
            normalize(property.getListingSource()),
            normalize(property.getListingUrl())
        );
    }

    private String appendNote(String existing, String addition) {
        String current = existing == null ? "" : existing.trim();
        String next = addition == null ? "" : addition.trim();
        if (current.isBlank()) {
            return next;
        }
        if (next.isBlank()) {
            return current;
        }
        return current + "\n" + next;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    }
}
