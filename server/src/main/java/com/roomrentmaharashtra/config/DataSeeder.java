package com.roomrentmaharashtra.config;

import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                                   @Value("${app.seed-demo-data:false}") boolean seedDemoData,
                                   @Value("${app.purge-legacy-demo-listings:true}") boolean purgeLegacyDemoListings) {
        return args -> {
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
        };
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
