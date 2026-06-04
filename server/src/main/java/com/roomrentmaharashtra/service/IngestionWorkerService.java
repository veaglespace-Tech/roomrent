package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.entity.IngestionRun;
import com.roomrentmaharashtra.entity.ListingSource;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.repository.IngestionRunRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class IngestionWorkerService {

    private final IngestionRunRepository ingestionRunRepository;
    private final PropertyRepository propertyRepository;

    public IngestionWorkerService(IngestionRunRepository ingestionRunRepository,
                                  PropertyRepository propertyRepository) {
        this.ingestionRunRepository = ingestionRunRepository;
        this.propertyRepository = propertyRepository;
    }

    public IngestionRun enqueue(Long runId) {
        IngestionRun run = ingestionRunRepository.findById(runId)
            .orElseThrow(() -> new ResourceNotFoundException("Ingestion run not found"));

        ListingSource source = run.getSource();
        if (source == null || !source.isAllowedForIngestion()) {
            markFinished(run, "BLOCKED", 0, 0, 0, 1,
                "Ingestion blocked because the source is not approved for ingestion.");
            return ingestionRunRepository.save(run);
        }

        List<Property> matchedListings = propertyRepository.findAll().stream()
            .filter(property -> matchesSource(property, source))
            .toList();

        int matchedCount = matchedListings.size();
        String note = matchedCount == 0
            ? "No source-linked listings were available to stage for this run."
            : "Processed " + matchedCount + " source-linked listings from approved source metadata.";

        markFinished(run, "COMPLETED", matchedCount, matchedCount, matchedCount, 0, note);
        return ingestionRunRepository.save(run);
    }

    private boolean matchesSource(Property property, ListingSource source) {
        String sourceDomain = normalize(source.getSourceDomain());
        String sourceName = normalize(source.getSourceName());
        String propertySource = normalize(property.getListingSource());
        String propertyUrl = normalize(property.getListingUrl());

        return (!sourceDomain.isBlank() && (propertySource.contains(sourceDomain) || propertyUrl.contains(sourceDomain)))
            || (!sourceName.isBlank() && propertySource.contains(sourceName));
    }

    private void markFinished(IngestionRun run,
                              String status,
                              int fetchedCount,
                              int parsedCount,
                              int publishedCount,
                              int errorCount,
                              String note) {
        run.setStatus(status);
        run.setFetchedCount(fetchedCount);
        run.setParsedCount(parsedCount);
        run.setPublishedCount(publishedCount);
        run.setErrorCount(errorCount);
        run.setNotes(appendNote(run.getNotes(), note));
        run.setFinishedAt(LocalDateTime.now());
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
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
