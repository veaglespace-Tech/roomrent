CREATE DATABASE IF NOT EXISTS roomrent_maharashtra;
USE roomrent_maharashtra;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    role VARCHAR(30) NOT NULL,
    subscription_plan VARCHAR(40) NULL,
    subscription_active BOOLEAN NOT NULL DEFAULT FALSE,
    subscription_started_at TIMESTAMP NULL,
    subscription_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NULL,
    location VARCHAR(180) NOT NULL,
    area_locality VARCHAR(160) NULL,
    city VARCHAR(120) NULL,
    district VARCHAR(120) NULL,
    state VARCHAR(120) NULL,
    category VARCHAR(80) NULL,
    sharing_type VARCHAR(60) NULL,
    furnished_status VARCHAR(40) NULL,
    listed_by_type VARCHAR(40) NULL,
    contact_number VARCHAR(30) NULL,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    availability_status VARCHAR(40) NULL,
    available_from_date VARCHAR(30) NULL,
    occupancy_details VARCHAR(160) NULL,
    listing_source VARCHAR(180) NULL,
    listing_url VARCHAR(500) NULL,
    moderation_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    published_at TIMESTAMP NULL,
    type VARCHAR(50) NOT NULL,
    gender VARCHAR(30) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_owner FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS property_amenities (
    property_id BIGINT NOT NULL,
    amenity VARCHAR(120) NOT NULL,
    CONSTRAINT fk_property_amenities FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_property_image FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_name VARCHAR(180) NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    allowed_for_ingestion BOOLEAN NOT NULL DEFAULT FALSE,
    terms_status VARCHAR(40) NOT NULL DEFAULT 'PENDING',
    notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_id BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    fetched_count INT NOT NULL DEFAULT 0,
    parsed_count INT NOT NULL DEFAULT 0,
    published_count INT NOT NULL DEFAULT 0,
    error_count INT NOT NULL DEFAULT 0,
    notes TEXT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,
    CONSTRAINT fk_ingestion_source FOREIGN KEY (source_id) REFERENCES listing_sources (id)
);

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enquiry_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_enquiry_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    contact_name VARCHAR(120) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT fk_lead_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    CONSTRAINT uq_saved UNIQUE (user_id, property_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compare_properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_compare UNIQUE (user_id, property_id),
    CONSTRAINT fk_compare_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_compare_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_search_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    label VARCHAR(180) NOT NULL,
    filters_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_search_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(120) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
