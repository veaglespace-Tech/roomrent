package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.enquiry.EnquiryRequest;
import com.roomrentmaharashtra.dto.enquiry.EnquiryResponse;
import com.roomrentmaharashtra.entity.Enquiry;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.repository.EnquiryRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          PropertyRepository propertyRepository,
                          UserService userService) {
        this.enquiryRepository = enquiryRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
    }

    public EnquiryResponse createEnquiry(EnquiryRequest request, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(request.propertyId())
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        Enquiry enquiry = new Enquiry();
        enquiry.setProperty(property);
        enquiry.setUser(user);
        enquiry.setMessage(request.message());

        Enquiry saved = enquiryRepository.save(enquiry);
        return toResponse(saved);
    }

    public List<EnquiryResponse> getOwnerEnquiries(Authentication authentication) {
        User owner = userService.getCurrentUser(authentication);
        return enquiryRepository.findByPropertyCreatedByOrderByCreatedAtDesc(owner).stream()
            .map(this::toResponse)
            .toList();
    }

    public List<EnquiryResponse> getMyEnquiries(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return enquiryRepository.findByUser(user).stream()
            .map(this::toResponse)
            .toList();
    }

    private EnquiryResponse toResponse(Enquiry enquiry) {
        return new EnquiryResponse(
            enquiry.getId(),
            enquiry.getProperty().getId(),
            enquiry.getProperty().getTitle(),
            enquiry.getUser().getName(),
            enquiry.getUser().getEmail(),
            enquiry.getMessage(),
            enquiry.getCreatedAt()
        );
    }
}

