package com.roomrentmaharashtra.service;

import com.roomrentmaharashtra.dto.property.AdminDashboardResponse;
import com.roomrentmaharashtra.dto.property.PropertyFilterRequest;
import com.roomrentmaharashtra.dto.property.PropertyRequest;
import com.roomrentmaharashtra.dto.property.PropertyResponse;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.PropertyImage;
import com.roomrentmaharashtra.entity.PropertyType;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.SavedProperty;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.exception.ResourceNotFoundException;
import com.roomrentmaharashtra.exception.UnauthorizedException;
import com.roomrentmaharashtra.repository.EnquiryRepository;
import com.roomrentmaharashtra.repository.PropertyRepository;
import com.roomrentmaharashtra.repository.SavedPropertyRepository;
import com.roomrentmaharashtra.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final SavedPropertyRepository savedPropertyRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final EnquiryRepository enquiryRepository;

    public PropertyService(PropertyRepository propertyRepository,
                           SavedPropertyRepository savedPropertyRepository,
                           UserService userService,
                           UserRepository userRepository,
                           EnquiryRepository enquiryRepository) {
        this.propertyRepository = propertyRepository;
        this.savedPropertyRepository = savedPropertyRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.enquiryRepository = enquiryRepository;
    }

    public Page<PropertyResponse> getProperties(PropertyFilterRequest filterRequest, Pageable pageable, Authentication authentication) {
        User currentUser = userService.getCurrentUserOptional(authentication).orElse(null);
        Page<Property> propertyPage = propertyRepository.findAll(buildSpecification(filterRequest), pageable);
        return propertyPage.map(property -> toResponse(property, currentUser));
    }

    public PropertyResponse getPropertyById(Long id, Authentication authentication) {
        User currentUser = userService.getCurrentUserOptional(authentication).orElse(null);
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return toResponse(property, currentUser);
    }

    public PropertyResponse createProperty(PropertyRequest request, Authentication authentication) {
        User owner = userService.getCurrentUser(authentication);
        if (!userService.hasActiveListingPlan(owner)) {
            throw new UnauthorizedException("Choose an active listing plan before adding a property");
        }

        Property property = new Property();
        applyRequest(property, request, owner);
        Property saved = propertyRepository.save(property);
        return toResponse(saved, owner);
    }

    public PropertyResponse updateProperty(Long id, PropertyRequest request, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        boolean isOwner = property.getCreatedBy().getId().equals(currentUser.getId());
        if (!isOwner && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You cannot edit this property");
        }

        applyRequest(property, request, property.getCreatedBy());
        Property updated = propertyRepository.save(property);
        return toResponse(updated, currentUser);
    }

    public void deleteProperty(Long id, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        boolean isOwner = property.getCreatedBy().getId().equals(currentUser.getId());
        if (!isOwner && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You cannot delete this property");
        }

        propertyRepository.delete(property);
    }

    public List<PropertyResponse> getOwnerListings(Authentication authentication) {
        User owner = userService.getCurrentUser(authentication);
        return propertyRepository.findByCreatedBy(owner).stream()
            .map(property -> toResponse(property, owner))
            .collect(Collectors.toList());
    }

    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalSubscribers = userService.countActiveListingPlanUsers();
        long totalProperties = propertyRepository.count();
        long totalEnquiries = enquiryRepository.count();
        return new AdminDashboardResponse(totalUsers, totalSubscribers, totalProperties, totalEnquiries);
    }

    public List<PropertyResponse> getAllAdminProperties(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        return propertyRepository.findAll().stream()
            .map(property -> toResponse(property, currentUser))
            .collect(Collectors.toList());
    }

    private void applyRequest(Property property, PropertyRequest request, User owner) {
        property.setTitle(clean(request.title()));
        property.setDescription(clean(request.description()));
        property.setPrice(request.price());
        property.setSecurityDeposit(request.securityDeposit());
        property.setLocation(clean(request.location()));
        property.setAreaLocality(cleanOptional(request.areaLocality()));
        property.setCity(cleanOptional(request.city()));
        property.setDistrict(cleanOptional(request.district()));
        property.setState(cleanOptional(request.state()));
        property.setCategory(cleanOptional(request.category()));
        property.setSharingType(cleanOptional(request.sharingType()));
        property.setFurnishedStatus(cleanOptional(request.furnishedStatus()));
        property.setListedByType(cleanOptional(request.listedByType()));
        property.setContactNumber(cleanOptional(request.contactNumber()));
        property.setLatitude(request.latitude());
        property.setLongitude(request.longitude());
        property.setAvailabilityStatus(cleanOptional(request.availabilityStatus()));
        property.setAvailableFromDate(cleanOptional(request.availableFromDate()));
        property.setOccupancyDetails(cleanOptional(request.occupancyDetails()));
        property.setListingSource(cleanOptional(request.listingSource()));
        property.setListingUrl(cleanOptional(request.listingUrl()));
        property.setType(request.type());
        property.setGender(request.gender());
        property.setAmenities(request.amenities().stream()
            .map(this::clean)
            .filter(value -> !value.isBlank())
            .collect(Collectors.collectingAndThen(
                Collectors.toCollection(LinkedHashSet::new),
                ArrayList::new
            )));
        property.setCreatedBy(owner);
        property.clearImages();
        request.imageUrls().stream().map(this::clean).forEach(url -> {
            PropertyImage image = new PropertyImage();
            image.setImageUrl(url);
            property.addImage(image);
        });
    }

    private PropertyResponse toResponse(Property property, User currentUser) {
        boolean isSaved = false;
        if (currentUser != null) {
            isSaved = savedPropertyRepository.findByUserAndProperty(currentUser, property).isPresent();
        }

        return new PropertyResponse(
            property.getId(),
            property.getTitle(),
            property.getDescription(),
            property.getPrice(),
            property.getSecurityDeposit(),
            property.getLocation(),
            property.getAreaLocality(),
            property.getCity(),
            property.getDistrict(),
            property.getState(),
            property.getCategory(),
            property.getSharingType(),
            property.getFurnishedStatus(),
            property.getListedByType(),
            property.getContactNumber(),
            property.getLatitude(),
            property.getLongitude(),
            property.getAvailabilityStatus(),
            property.getAvailableFromDate(),
            property.getOccupancyDetails(),
            property.getListingSource(),
            property.getListingUrl(),
            property.getType(),
            property.getGender(),
            property.getAmenities(),
            property.getImages().stream().map(PropertyImage::getImageUrl).toList(),
            new PropertyResponse.OwnerSummary(
                property.getCreatedBy().getId(),
                property.getCreatedBy().getName(),
                property.getCreatedBy().getEmail()
            ),
            isSaved,
            property.getCreatedAt(),
            property.getModerationStatus(),
            property.getPublishedAt()
        );
    }

    private Specification<Property> buildSpecification(PropertyFilterRequest filterRequest) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filterRequest == null) {
                return cb.and(predicates.toArray(Predicate[]::new));
            }
            if (filterRequest.location() != null && !filterRequest.location().isBlank()) {
                String pattern = "%" + filterRequest.location().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("location")), pattern),
                    cb.like(cb.lower(root.get("areaLocality")), pattern),
                    cb.like(cb.lower(root.get("city")), pattern),
                    cb.like(cb.lower(root.get("district")), pattern),
                    cb.like(cb.lower(root.get("state")), pattern),
                    cb.like(cb.lower(root.get("category")), pattern),
                    cb.like(cb.lower(root.get("sharingType")), pattern),
                    cb.like(cb.lower(root.get("listedByType")), pattern),
                    cb.like(cb.lower(root.get("listingSource")), pattern)
                ));
            }
            if (filterRequest.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filterRequest.minPrice()));
            }
            if (filterRequest.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filterRequest.maxPrice()));
            }
            if (filterRequest.type() != null) {
                predicates.add(cb.equal(root.get("type"), filterRequest.type()));
            }
            if (filterRequest.gender() != null) {
                predicates.add(cb.equal(root.get("gender"), filterRequest.gender()));
            }
            if (filterRequest.furnishedStatus() != null && !filterRequest.furnishedStatus().isBlank()) {
                predicates.add(cb.equal(root.get("furnishedStatus"), filterRequest.furnishedStatus()));
            }
            if (filterRequest.sharingType() != null && !filterRequest.sharingType().isBlank()) {
                predicates.add(cb.equal(root.get("sharingType"), filterRequest.sharingType()));
            }
            if (filterRequest.listedByType() != null && !filterRequest.listedByType().isBlank()) {
                predicates.add(cb.equal(root.get("listedByType"), filterRequest.listedByType()));
            }
            if (filterRequest.amenities() != null && !filterRequest.amenities().isEmpty()) {
                for (String amenity : filterRequest.amenities()) {
                    predicates.add(cb.isMember(amenity, root.get("amenities")));
                }
            }
            predicates.add(cb.or(
                cb.isNull(root.get("moderationStatus")),
                cb.equal(root.get("moderationStatus"), "APPROVED")
            ));
            query.distinct(true);
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanOptional(String value) {
        String cleaned = clean(value);
        return cleaned.isBlank() ? null : cleaned;
    }
}
