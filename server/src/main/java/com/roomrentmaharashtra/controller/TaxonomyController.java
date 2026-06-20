package com.roomrentmaharashtra.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/taxonomy")
public class TaxonomyController {

    private final Map<String, List<String>> cityToLocalities = Map.of(
        "pune", List.of("Kothrud", "Wakad", "Hinjewadi", "Viman Nagar", "Kharadi"),
        "mumbai", List.of("Andheri", "Bandra", "Borivali", "Goregaon", "Powai"),
        "nagpur", List.of("Dharampeth", "Sitabuldi", "Manish Nagar", "Wardhaman Nagar", "Sadar"),
        "nashik", List.of("College Road", "Gangapur Road", "Indira Nagar", "CIDCO", "Panchavati"),
        "aurangabad", List.of("CIDCO", "Cidco Waluj Mahanagar", "Osmanpura", "Shahgunj", "Garkheda")
    );

    @GetMapping("/cities")
    public List<String> getCities() {
        return List.of("Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad", "Thane", "Navi Mumbai");
    }

    @GetMapping("/districts")
    public List<String> getDistricts() {
        return List.of("Pune", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nashik", "Aurangabad", "Thane", "Palghar");
    }

    @GetMapping("/cities/{slug}/localities")
    public List<String> getLocalitiesForCity(@PathVariable String slug) {
        return cityToLocalities.getOrDefault(slug.toLowerCase(), List.of());
    }
}
