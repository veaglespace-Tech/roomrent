package com.roomrentmaharashtra.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "listing_sources")
public class ListingSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", nullable = false, length = 180)
    private String sourceName;

    @Column(name = "source_domain", nullable = false, length = 255)
    private String sourceDomain;

    @Column(name = "allowed_for_ingestion", nullable = false)
    private boolean allowedForIngestion;

    @Column(name = "terms_status", nullable = false, length = 40)
    private String termsStatus;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getSourceDomain() {
        return sourceDomain;
    }

    public void setSourceDomain(String sourceDomain) {
        this.sourceDomain = sourceDomain;
    }

    public boolean isAllowedForIngestion() {
        return allowedForIngestion;
    }

    public void setAllowedForIngestion(boolean allowedForIngestion) {
        this.allowedForIngestion = allowedForIngestion;
    }

    public String getTermsStatus() {
        return termsStatus;
    }

    public void setTermsStatus(String termsStatus) {
        this.termsStatus = termsStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
