package com.roomrentmaharashtra.config;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.PropertyType;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.repository.PropertyRepository;
import com.roomrentmaharashtra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Configuration
public class DataSeeder {

    private static final Set<String> LEGACY_DEMO_TITLES = Set.of(
        "Sumedha PG for Boys and Mens, Khatipura",
        "2 room set house in Sodala on Hawa Sarak",
        "3 BHK flat in Patrakar Colony on New Sanganer Road",
        "Secure Girls Hostel in Malviya Nagar",
        "Private Room for Working Boys in Vaishali Nagar",
        "Compact Shared Flat for Students in Jagatpura",
        "Family Flat near Gopalpura Bypass",
        "Boys PG near Mansarovar Metro",
        "Girls PG in Vidhyadhar Nagar",
        "Sunrise PG near FC Road",
        "Teal Nest Girls Hostel",
        "Urban Room for Working Boys",
        "Compact Shared Flat for Students"
    );

    private static final Set<String> LEGACY_DEMO_MARKERS = Set.of(
        "jaipur",
        "rajasthan",
        "demo",
        "sample",
        "mock",
        "test listing"
    );

    @Bean
    CommandLineRunner seedDatabase(PropertyRepository propertyRepository,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder,
                                   @Value("${app.seed-demo-data:false}") boolean seedDemoData,
                                   @Value("${app.purge-legacy-demo-listings:true}") boolean purgeLegacyDemoListings,
                                   @Value("${app.seed-real-source-records:true}") boolean seedRealSourceRecords,
                                   @Value("${app.admin.email:admin@roomrentmaharashtra.com}") String adminEmail,
                                   @Value("${app.admin.password:Admin@12345}") String adminPassword,
                                   @Value("${app.admin.name:RoomRent Maharashtra Admin}") String adminName,
                                   @Value("${app.admin.phone:9876543210}") String adminPhone) {
        return args -> {
            seedSuperAdmin(userRepository, passwordEncoder, adminEmail, adminPassword, adminName, adminPhone);

            if (purgeLegacyDemoListings) {
                List<Property> legacyDemoProperties = propertyRepository.findAll().stream()
                    .filter(this::isLegacyDemoProperty)
                    .toList();

                if (!legacyDemoProperties.isEmpty()) {
                    propertyRepository.deleteAll(legacyDemoProperties);
                }
            }

            if (seedDemoData) {
                // Production inventory should come from verified submissions only.
            }

            if (seedRealSourceRecords) {
                seedMahaReraProjectRecords(propertyRepository, userRepository, passwordEncoder);
            }
        };
    }

    private void seedSuperAdmin(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                String adminEmail,
                                String adminPassword,
                                String adminName,
                                String adminPhone) {
        userRepository.findByEmailIgnoreCase(adminEmail)
            .map(user -> {
                user.setRole(Role.ADMIN);
                user.setSubscriptionPlan("BUSINESS");
                user.setSubscriptionActive(true);
                if (user.getSubscriptionStartedAt() == null) {
                    user.setSubscriptionStartedAt(LocalDateTime.now());
                }
                return userRepository.save(user);
            })
            .orElseGet(() -> {
                User user = new User();
                user.setName(adminName);
                user.setPhone(adminPhone);
                user.setEmail(adminEmail.toLowerCase(Locale.ROOT));
                user.setPassword(passwordEncoder.encode(adminPassword));
                user.setRole(Role.ADMIN);
                user.setSubscriptionPlan("BUSINESS");
                user.setSubscriptionActive(true);
                user.setSubscriptionStartedAt(LocalDateTime.now());
                return userRepository.save(user);
            });
    }

    private void seedMahaReraProjectRecords(PropertyRepository propertyRepository,
                                            UserRepository userRepository,
                                            PasswordEncoder passwordEncoder) {
        User sourceOwner = userRepository.findByEmailIgnoreCase("source-data@roomrentmaharashtra.com")
            .orElseGet(() -> {
                User user = new User();
                user.setName("RoomRent Maharashtra Source Data");
                user.setEmail("source-data@roomrentmaharashtra.com");
                user.setPassword(passwordEncoder.encode("SourceData@123"));
                user.setRole(Role.ADMIN);
                user.setSubscriptionPlan("BUSINESS");
                user.setSubscriptionActive(true);
                user.setSubscriptionStartedAt(LocalDateTime.now());
                return userRepository.save(user);
            });

        Set<String> existingTitles = propertyRepository.findAll().stream()
            .map(Property::getTitle)
            .collect(java.util.stream.Collectors.toSet());

        List<Property> sourceRecords = List.of(
            sourceRecord("Raymond The Address", "Raymond Realty", "Bandra West", "Mumbai", "Mumbai City", "Wait 6.9/10 est."),
            sourceRecord("Raymond Realty Signia High", "Raymond Realty", "Bandra Kurla Complex", "Mumbai", "Mumbai City", "Wait 7.0/10 est."),
            sourceRecord("Rustomjee Azziano", "Rustomjee", "Juhu", "Mumbai", "Mumbai City", "Wait 6.9/10 est."),
            sourceRecord("Piramal Mahalaxmi", "Piramal Realty", "Mahalaxmi", "Mumbai", "Mumbai City", "Wait 6.9/10 est."),
            sourceRecord("Hiranandani Regent Hill", "Hiranandani Group", "Powai", "Mumbai", "Mumbai City", "Wait 7.0/10 est."),
            sourceRecord("Transcon Triumph", "Transcon Developers", "Andheri West", "Mumbai", "Mumbai City", "Wait 6.7/10 est.")
        );

        sourceRecords.stream()
            .filter(property -> !existingTitles.contains(property.getTitle()))
            .forEach(property -> {
                property.setCreatedBy(sourceOwner);
                propertyRepository.save(property);
            });
    }

    private Property sourceRecord(String title, String developer, String locality, String city, String district, String status) {
        Property property = new Property();
        property.setTitle(title);
        property.setDescription(
            title + " by " + developer + " is a Maharashtra project record sourced from Brickplot Open Data / MahaRERA public project records. " +
            "This is real source-backed project discovery data for sale-side research, not an active rental listing. Price and availability must be verified independently at the source."
        );
        property.setPrice(BigDecimal.ZERO);
        property.setLocation(locality + ", " + city + ", Maharashtra");
        property.setAreaLocality(locality);
        property.setCity(city);
        property.setDistrict(district);
        property.setState("Maharashtra");
        property.setCategory("For Sale / RERA Project");
        property.setSharingType("Independent");
        property.setFurnishedStatus("UNFURNISHED");
        property.setListedByType("MANAGER");
        property.setAvailabilityStatus("UPCOMING");
        property.setOccupancyDetails(status);
        property.setListingSource("Brickplot Open Data / MahaRERA public project records");
        property.setListingUrl("https://brickplot.com/data");
        property.setType(PropertyType.FLAT);
        property.setGender(GenderPreference.ANY);
        property.setAmenities(List.of("RERA project record", "Maharashtra source data", "Verify price at source"));
        return property;
    }

    private boolean isLegacyDemoProperty(Property property) {
        if (property == null) {
            return false;
        }

        if (LEGACY_DEMO_TITLES.contains(property.getTitle())) {
            return true;
        }

        String ownerEmail = property.getCreatedBy() != null ? property.getCreatedBy().getEmail() : "";
        if ("owner@roomrent.in".equalsIgnoreCase(ownerEmail) || "admin@roomrent.in".equalsIgnoreCase(ownerEmail)) {
            return true;
        }

        String combinedContent = String.join(" ",
            safe(property.getTitle()),
            safe(property.getDescription()),
            safe(property.getLocation()),
            safe(property.getAreaLocality()),
            safe(property.getCity()),
            safe(property.getDistrict()),
            safe(property.getState()),
            safe(property.getListingSource()),
            safe(property.getListingUrl())
        ).toLowerCase(Locale.ROOT);

        return LEGACY_DEMO_MARKERS.stream().anyMatch(combinedContent::contains);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
