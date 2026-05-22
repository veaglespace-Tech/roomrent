package com.roomrentmaharashtra.config;

import com.roomrentmaharashtra.entity.GenderPreference;
import com.roomrentmaharashtra.entity.Property;
import com.roomrentmaharashtra.entity.PropertyImage;
import com.roomrentmaharashtra.entity.PropertyType;
import com.roomrentmaharashtra.entity.Role;
import com.roomrentmaharashtra.entity.User;
import com.roomrentmaharashtra.repository.PropertyRepository;
import com.roomrentmaharashtra.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(UserRepository userRepository,
                                   PropertyRepository propertyRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = ensureUser(userRepository, passwordEncoder, "Admin Demo", "admin@roomrent.in", "admin123", Role.ADMIN);
            User owner = ensureUser(userRepository, passwordEncoder, "Owner Demo", "owner@roomrent.in", "owner123", Role.OWNER);
            ensureUser(userRepository, passwordEncoder, "Tenant Demo", "user@roomrent.in", "user123", Role.USER);

            List<Property> demoProperties = List.of(
                    buildProperty(
                        "Sumedha PG for Boys and Mens, Khatipura",
                        "Fully furnished boys PG with meals, Wi-Fi, daily housekeeping, and a hostel-style setup close to coaching hubs.",
                        new BigDecimal("6000"),
                        "Jaipur, Khatipura",
                        PropertyType.PG,
                        GenderPreference.BOYS,
                        owner,
                        List.of("WiFi", "Meals", "Housekeeping", "Study Desk"),
                        List.of(
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "2 room set house in Sodala on Hawa Sarak",
                        "Two room set with attached bathroom, kitchen access, and quick connectivity to offices and markets in Sodala.",
                        new BigDecimal("8500"),
                        "Jaipur, Sodala",
                        PropertyType.ROOM,
                        GenderPreference.ANY,
                        owner,
                        List.of("Attached Bath", "Kitchen Access", "Parking", "Power Backup"),
                        List.of(
                            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "3 BHK flat in Patrakar Colony on New Sanganer Road",
                        "Spacious family flat with car parking, balcony, and gated society access near the New Sanganer Road belt.",
                        new BigDecimal("15000"),
                        "Jaipur, Patrakar Colony",
                        PropertyType.FLAT,
                        GenderPreference.ANY,
                        owner,
                        List.of("Car Parking", "Balcony", "Gated Society", "Power Backup"),
                        List.of(
                            "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Secure Girls Hostel in Malviya Nagar",
                        "Girls hostel with biometric entry, laundry, attached washrooms, and a calm student-friendly lane.",
                        new BigDecimal("7200"),
                        "Jaipur, Malviya Nagar",
                        PropertyType.HOSTEL,
                        GenderPreference.GIRLS,
                        owner,
                        List.of("Biometric Entry", "Attached Bath", "Laundry", "Common Lounge"),
                        List.of(
                            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Private Room for Working Boys in Vaishali Nagar",
                        "Private room with balcony, inverter backup, bike parking, and easy access to the main market road.",
                        new BigDecimal("9800"),
                        "Jaipur, Vaishali Nagar",
                        PropertyType.ROOM,
                        GenderPreference.BOYS,
                        owner,
                        List.of("Balcony", "Power Backup", "Kitchen Access", "Parking"),
                        List.of(
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Compact Shared Flat for Students in Jagatpura",
                        "Two-bedroom shared flat with washing machine, fridge, and short commute to universities and coaching institutes.",
                        new BigDecimal("12000"),
                        "Jaipur, Jagatpura",
                        PropertyType.FLAT,
                        GenderPreference.ANY,
                        owner,
                        List.of("Washing Machine", "Fridge", "Gated Society", "Metro Access"),
                        List.of(
                            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Family Flat near Gopalpura Bypass",
                        "Well-lit flat with lift access, car parking, and enough space for a small family near key Jaipur connectors.",
                        new BigDecimal("18500"),
                        "Jaipur, Gopalpura",
                        PropertyType.FLAT,
                        GenderPreference.ANY,
                        owner,
                        List.of("Car Parking", "Lift", "Power Backup", "Gated Society"),
                        List.of(
                            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Boys PG near Mansarovar Metro",
                        "Budget PG for students and working boys with meals, housekeeping, and a short walk to public transport.",
                        new BigDecimal("6500"),
                        "Jaipur, Mansarovar",
                        PropertyType.PG,
                        GenderPreference.BOYS,
                        owner,
                        List.of("WiFi", "Meals", "Laundry", "Housekeeping"),
                        List.of(
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
                        )
                    ),
                    buildProperty(
                        "Girls PG in Vidhyadhar Nagar",
                        "Safe girls PG with attached baths, curated meals, and a common lounge in a well-connected locality.",
                        new BigDecimal("7800"),
                        "Jaipur, Vidhyadhar Nagar",
                        PropertyType.PG,
                        GenderPreference.GIRLS,
                        owner,
                        List.of("Attached Bath", "Meals", "Common Lounge", "WiFi"),
                        List.of(
                            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
                            "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80"
                        )
                    )
                );

            Set<String> existingTitles = propertyRepository.findAll().stream()
                .map(Property::getTitle)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

            List<Property> missingProperties = demoProperties.stream()
                .filter(property -> !existingTitles.contains(property.getTitle()))
                .toList();

            if (!missingProperties.isEmpty()) {
                propertyRepository.saveAll(missingProperties);
            }

            propertyRepository.findAll().forEach(property -> {
                if (property.getAmenities() == null || property.getAmenities().isEmpty()) {
                    property.setAmenities(new ArrayList<>(defaultAmenities(property.getType())));
                    propertyRepository.save(property);
                }
            });
        };
    }

    private User ensureUser(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            String name,
                            String email,
                            String rawPassword,
                            Role role) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            return userRepository.save(user);
        });
    }

    private Property buildProperty(String title,
                                   String description,
                                   BigDecimal price,
                                   String location,
                                   PropertyType type,
                                   GenderPreference gender,
                                   User owner,
                                   List<String> amenities,
                                   List<String> imageUrls) {
        Property property = new Property();
        property.setTitle(title);
        property.setDescription(description);
        property.setPrice(price);
        property.setLocation(location);
        property.setType(type);
        property.setGender(gender);
        property.setAmenities(amenities);
        property.setCreatedBy(owner);

        imageUrls.forEach(url -> {
            PropertyImage image = new PropertyImage();
            image.setImageUrl(url);
            property.addImage(image);
        });

        return property;
    }

    private List<String> defaultAmenities(PropertyType type) {
        return switch (type) {
            case PG -> List.of("WiFi", "Meals", "Housekeeping", "Study Desk");
            case HOSTEL -> List.of("Laundry", "Attached Bath", "Common Lounge", "Biometric Entry");
            case ROOM -> List.of("Balcony", "Power Backup", "Kitchen Access", "Parking");
            case FLAT -> List.of("Washing Machine", "Fridge", "Gated Society", "Metro Access");
        };
    }
}
