package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.lead.LeadRequest;
import com.roomrentmaharashtra.dto.lead.LeadResponse;
import com.roomrentmaharashtra.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping("/leads")
    public LeadResponse createLead(@Valid @RequestBody LeadRequest request, Authentication authentication) {
        return leadService.createLead(request, authentication);
    }

    @GetMapping("/owner/leads")
    public List<LeadResponse> getOwnerLeads(Authentication authentication) {
        return leadService.getOwnerLeads(authentication);
    }
}
