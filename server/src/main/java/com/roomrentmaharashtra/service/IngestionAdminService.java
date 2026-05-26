package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.ingestion.IngestionRunRequest;
import com.roomrentmaharashtra.dto.ingestion.IngestionRunResponse;
import com.roomrentmaharashtra.dto.ingestion.ListingSourceModerationRequest;
import com.roomrentmaharashtra.dto.ingestion.ListingSourceRequest;
import com.roomrentmaharashtra.dto.ingestion.ListingSourceResponse;
import com.roomrentmaharashtra.entity.IngestionRun;
import com.roomrentmaharashtra.entity.ListingSource;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.IngestionRunRepository;
import com.roomrentmaharashtra.repository.ListingSourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngestionAdminService {

    private final ListingSourceRepository listingSourceRepository;
    private final IngestionRunRepository ingestionRunRepository;
    private final IngestionWorkerService ingestionWorkerService;
    private final DedupeJobService dedupeJobService;

    public IngestionAdminService(ListingSourceRepository listingSourceRepository,
                                 IngestionRunRepository ingestionRunRepository,
                                 IngestionWorkerService ingestionWorkerService,
                                 DedupeJobService dedupeJobService) {
        this.listingSourceRepository = listingSourceRepository;
        this.ingestionRunRepository = ingestionRunRepository;
        this.ingestionWorkerService = ingestionWorkerService;
        this.dedupeJobService = dedupeJobService;
    }

    public List<ListingSourceResponse> getSources() {
        return listingSourceRepository.findAll().stream().map(this::toSourceResponse).toList();
    }

    public ListingSourceResponse createSource(ListingSourceRequest request) {
        ListingSource source = new ListingSource();
        source.setSourceName(request.sourceName());
        source.setSourceDomain(request.sourceDomain());
        source.setAllowedForIngestion(request.allowedForIngestion());
        source.setTermsStatus(request.termsStatus());
        source.setNotes(request.notes());
        return toSourceResponse(listingSourceRepository.save(source));
    }

    public ListingSourceResponse moderateSource(Long id, ListingSourceModerationRequest request) {
        ListingSource source = listingSourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Listing source not found"));
        source.setAllowedForIngestion(request.allowedForIngestion());
        source.setTermsStatus(request.termsStatus());
        source.setNotes(request.notes());
        return toSourceResponse(listingSourceRepository.save(source));
    }

    public List<IngestionRunResponse> getRuns() {
        return ingestionRunRepository.findTop20ByOrderByStartedAtDesc().stream().map(this::toRunResponse).toList();
    }

    public IngestionRunResponse enqueueRun(IngestionRunRequest request) {
        ListingSource source = listingSourceRepository.findById(request.sourceId())
            .orElseThrow(() -> new ResourceNotFoundException("Listing source not found"));

        IngestionRun run = new IngestionRun();
        run.setSource(source);
        run.setStatus("QUEUED");
        run.setFetchedCount(0);
        run.setParsedCount(0);
        run.setPublishedCount(0);
        run.setErrorCount(0);
        run.setNotes(request.notes());
        IngestionRun saved = ingestionRunRepository.save(run);
        ingestionWorkerService.enqueue(saved.getId());
        dedupeJobService.scheduleForRun(saved.getId());
        return toRunResponse(saved);
    }

    private ListingSourceResponse toSourceResponse(ListingSource source) {
        return new ListingSourceResponse(
            source.getId(),
            source.getSourceName(),
            source.getSourceDomain(),
            source.isAllowedForIngestion(),
            source.getTermsStatus(),
            source.getNotes()
        );
    }

    private IngestionRunResponse toRunResponse(IngestionRun run) {
        return new IngestionRunResponse(
            run.getId(),
            run.getSource().getSourceName(),
            run.getSource().getSourceDomain(),
            run.getStatus(),
            run.getFetchedCount(),
            run.getParsedCount(),
            run.getPublishedCount(),
            run.getErrorCount(),
            run.getStartedAt(),
            run.getFinishedAt(),
            run.getNotes()
        );
    }
}
