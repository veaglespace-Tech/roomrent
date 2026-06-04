CREATE DATABASE IF NOT EXISTS roomrent_maharashtra;
USE roomrent_maharashtra;

CREATE TABLE IF NOT EXISTS states (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(160) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS districts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    state_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    CONSTRAINT fk_district_state FOREIGN KEY (state_id) REFERENCES states (id)
);

CREATE TABLE IF NOT EXISTS cities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    district_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    CONSTRAINT fk_city_district FOREIGN KEY (district_id) REFERENCES districts (id)
);

CREATE TABLE IF NOT EXISTS localities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id BIGINT NOT NULL,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    UNIQUE KEY uq_locality_city_slug (city_id, slug),
    CONSTRAINT fk_locality_city FOREIGN KEY (city_id) REFERENCES cities (id)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    phone VARCHAR(30) NULL,
    subscription_plan VARCHAR(40) NULL,
    subscription_active BOOLEAN NOT NULL DEFAULT FALSE,
    subscription_started_at TIMESTAMP NULL,
    subscription_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    CONSTRAINT fk_type_category FOREIGN KEY (category_id) REFERENCES property_categories (id)
);

CREATE TABLE IF NOT EXISTS listing_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_name VARCHAR(180) NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    allowed_for_ingestion BOOLEAN NOT NULL DEFAULT FALSE,
    robots_checked_at TIMESTAMP NULL,
    terms_reviewed_at TIMESTAMP NULL,
    terms_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_by BIGINT NULL,
    source_id BIGINT NULL,
    property_type_id BIGINT NOT NULL,
    city_id BIGINT NOT NULL,
    district_id BIGINT NOT NULL,
    locality_id BIGINT NULL,
    title VARCHAR(220) NOT NULL,
    slug VARCHAR(260) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    rent_amount DECIMAL(12, 2) NOT NULL,
    security_deposit DECIMAL(12, 2) NULL,
    sharing_type VARCHAR(40) NULL,
    furnished_status VARCHAR(40) NULL,
    listed_by_type VARCHAR(40) NOT NULL,
    contact_number VARCHAR(30) NULL,
    location_text VARCHAR(255) NOT NULL,
    area_locality VARCHAR(160) NULL,
    state_name VARCHAR(120) NOT NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    availability_status VARCHAR(40) NOT NULL DEFAULT 'AVAILABLE',
    available_from_date DATE NULL,
    gender_preference VARCHAR(30) NULL,
    occupancy_details VARCHAR(160) NULL,
    listing_source_label VARCHAR(180) NULL,
    listing_url VARCHAR(500) NULL,
    last_updated_at TIMESTAMP NULL,
    moderation_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_listing_user FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT fk_listing_source FOREIGN KEY (source_id) REFERENCES listing_sources (id),
    CONSTRAINT fk_listing_type FOREIGN KEY (property_type_id) REFERENCES property_types (id),
    CONSTRAINT fk_listing_city FOREIGN KEY (city_id) REFERENCES cities (id),
    CONSTRAINT fk_listing_district FOREIGN KEY (district_id) REFERENCES districts (id),
    CONSTRAINT fk_listing_locality FOREIGN KEY (locality_id) REFERENCES localities (id)
);

CREATE TABLE IF NOT EXISTS amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS listing_amenities (
    listing_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (listing_id, amenity_id),
    CONSTRAINT fk_listing_amenity_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_listing_amenity_amenity FOREIGN KEY (amenity_id) REFERENCES amenities (id)
);

CREATE TABLE IF NOT EXISTS listing_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    optimized_url VARCHAR(500) NULL,
    source_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_listing_image_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    contact_name VARCHAR(120) NOT NULL,
    contact_email VARCHAR(180) NULL,
    contact_phone VARCHAR(30) NULL,
    message TEXT NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_lead_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    review_text TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    listing_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saved_listing (user_id, listing_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_id BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,
    fetched_count INT NOT NULL DEFAULT 0,
    parsed_count INT NOT NULL DEFAULT 0,
    published_count INT NOT NULL DEFAULT 0,
    error_count INT NOT NULL DEFAULT 0,
    notes TEXT NULL,
    CONSTRAINT fk_ingestion_run_source FOREIGN KEY (source_id) REFERENCES listing_sources (id)
);

CREATE TABLE IF NOT EXISTS raw_listing_snapshots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ingestion_run_id BIGINT NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    external_id VARCHAR(180) NULL,
    payload_json JSON NOT NULL,
    fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_snapshot_run FOREIGN KEY (ingestion_run_id) REFERENCES ingestion_runs (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dedupe_keys (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    listing_id BIGINT NOT NULL,
    fingerprint_hash VARCHAR(128) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_dedupe_fingerprint (fingerprint_hash),
    CONSTRAINT fk_dedupe_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);
