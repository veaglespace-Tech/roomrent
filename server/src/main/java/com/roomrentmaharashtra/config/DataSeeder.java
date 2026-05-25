package com.roomrentmaharashtra.config;

import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
        "Girls PG in Vidhyadhar Nagar"
    );

    @Bean
    CommandLineRunner seedDatabase(PropertyRepository propertyRepository,
                                   @Value("${app.seed-demo-data:false}") boolean seedDemoData,
                                   @Value("${app.purge-legacy-demo-listings:true}") boolean purgeLegacyDemoListings) {
        return args -> {
            if (purgeLegacyDemoListings) {
                List<Property> legacyDemoProperties = propertyRepository.findAll().stream()
                    .filter(property -> LEGACY_DEMO_TITLES.contains(property.getTitle()))
                    .collect(Collectors.toList());

                if (!legacyDemoProperties.isEmpty()) {
                    propertyRepository.deleteAll(legacyDemoProperties);
                }
            }

            if (seedDemoData) {
                // Intentionally left empty. Maharashtra production data should come
                // from verified submissions and compliant ingestion pipelines only.
            }
        };
    }
}
