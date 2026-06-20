package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.lead.LeadRequest;
import com.roomrentmaharashtra.dto.lead.LeadResponse;
import com.roomrentmaharashtra.entity.Lead;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.LeadRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    public LeadService(LeadRepository leadRepository,
                       PropertyRepository propertyRepository,
                       UserService userService) {
        this.leadRepository = leadRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
    }

    public LeadResponse createLead(LeadRequest request, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            throw new IllegalArgumentException("Add a phone number to request a callback");
        }

        Property property = propertyRepository.findById(request.propertyId())
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        Lead lead = new Lead();
        lead.setProperty(property);
        lead.setUser(user);
        lead.setContactName(user.getName());
        lead.setContactPhone(user.getPhone());

        return toResponse(leadRepository.save(lead));
    }

    public List<LeadResponse> getOwnerLeads(Authentication authentication) {
        User owner = userService.getCurrentUser(authentication);
        return leadRepository.findByPropertyCreatedByOrderByCreatedAtDesc(owner).stream()
            .map(this::toResponse)
            .toList();
    }

    public LeadResponse updateLeadStatus(Long id, Map<String, String> payload, Authentication authentication) {
        User owner = userService.getCurrentUser(authentication);
        Lead lead = leadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));

        if (!lead.getProperty().getCreatedBy().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You don't have permission to update this lead");
        }

        if (payload.containsKey("status")) {
            lead.setStatus(payload.get("status"));
        }
        return toResponse(leadRepository.save(lead));
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
            lead.getId(),
            lead.getProperty().getId(),
            lead.getProperty().getTitle(),
            lead.getContactName(),
            lead.getContactPhone(),
            lead.getStatus(),
            lead.getCreatedAt()
        );
    }
}
