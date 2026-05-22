package com.roomrentmaharashtra.controller;

import com.roomrentmaharashtra.dto.enquiry.EnquiryRequest;
import com.roomrentmaharashtra.dto.enquiry.EnquiryResponse;
import com.roomrentmaharashtra.service.EnquiryService;
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
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping("/enquiry")
    public EnquiryResponse createEnquiry(@Valid @RequestBody EnquiryRequest request, Authentication authentication) {
        return enquiryService.createEnquiry(request, authentication);
    }

    @GetMapping("/owner/enquiries")
    public List<EnquiryResponse> getOwnerEnquiries(Authentication authentication) {
        return enquiryService.getOwnerEnquiries(authentication);
    }

    @GetMapping("/users/enquiries")
    public List<EnquiryResponse> getMyEnquiries(Authentication authentication) {
        return enquiryService.getMyEnquiries(authentication);
    }
}

