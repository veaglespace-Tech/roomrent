# Maharashtra-Wide Platform Plan

## Recommended Brand Names

Primary recommendation:
- `RoomRentMaharashtra`

Other domain-friendly options:
- `MahaRentHub`
- `RentMaha`
- `MaharashtraRooms`
- `MahaStay`
- `RentMitra`
- `StayMaha`
- `MahaNest`
- `MahaLease`

Selection criteria:
- Avoid city-specific naming
- Easy to spell and remember
- Works for both residential and commercial inventory
- Supports SEO with Maharashtra intent

## Current Codebase Analysis

Current strengths:
- Next.js client with public pages, auth, dashboard, and property listing views
- Spring Boot API with JWT auth, owner/admin flows, saved properties, and enquiries
- Basic listing filters and owner property management
- MySQL-backed schema already in place

Current gaps for Maharashtra rollout:
- Public UI was previously Jaipur-branded
- Listing model is too small for state-wide inventory, source tracking, geodata, SEO, and deduplication
- No city/district taxonomy
- No compliant ingestion pipeline
- No map-ready coordinates workflow
- No source audit or moderation pipeline
- No lead routing or review model

## Target System Architecture

### Frontend
- `Next.js App Router`
- Public discovery pages
- City pages
- District pages
- Locality pages
- Listing detail pages
- Map search
- User submission dashboard
- Admin moderation dashboard

### Backend Services
- `API Gateway / Web App API`
- `Auth Service`
- `Listing Service`
- `Taxonomy Service`
- `Lead Service`
- `Moderation Service`
- `Ingestion Service`
- `Deduplication Service`
- `Media Processing Service`
- `SEO Page Generation Service`

### Data Stores
- `MySQL` for transactional entities
- `Redis` for caching filters, city pages, search summaries
- `Object Storage` for optimized images and source snapshots
- `Queue` for ingestion, image processing, dedupe, and moderation jobs
- `Search Index` optional phase-two addition for large-scale search

## Proposed Folder Structure

```text
client/
  app/
    (public)/
      page.tsx
      properties/
      cities/[citySlug]/
      districts/[districtSlug]/
      localities/[localitySlug]/
      map-search/
    (dashboard)/
      dashboard/
        admin/
        owner/
        leads/
  components/
    city/
    district/
    listing/
    map/
    seo/
  services/
  store/
  types/

server/
  src/main/java/com/roomrentmaharashtra/
    config/
    controller/
    dto/
    entity/
    repository/
    service/
    jobs/
    ingestion/
    moderation/
    dedupe/
    media/
    seo/

database/
  schema.sql
  schema_maharashtra_v2.sql
  migrations/

docs/
  maharashtra-platform-plan.md
```

## Listing Data Model Requirements

Each listing should support:
- Property title
- Property type
- Category
- Rent amount
- Security deposit
- Sharing type
- Furnished status
- Owner or broker type
- Contact number if lawfully public
- Location text
- Area or locality
- City
- District
- State
- Latitude
- Longitude
- Amenities
- Images
- Description
- Availability status
- Available from date
- Gender preference
- Occupancy details
- Listing source
- Listing URL
- Last updated date

## Property Taxonomy

### Categories
1. Hostels
2. PG Accommodation
3. Rooms
4. Flats / Apartments
5. Commercial Properties

### Subcategories

Hostels:
- Boys Hostel
- Girls Hostel

PG Accommodation:
- Boys PG
- Girls PG

Rooms:
- 1 Sharing
- 2 Sharing
- 3 Sharing
- 4 Sharing
- Single Room

Flats / Apartments:
- 1 RK
- 1 BHK
- 2 BHK
- 3 BHK
- 4 BHK+
- Studio Apartment

Commercial:
- Shops
- Offices
- Co-working Spaces

## City and District Coverage

Launch coverage must support:
- Mumbai
- Pune
- Nagpur
- Nashik
- Thane
- Navi Mumbai
- Aurangabad
- Kolhapur
- Solapur
- Sangli
- Satara
- Ahmednagar
- Jalgaon
- Amravati
- Akola
- Latur
- Nanded
- Ratnagiri
- Sindhudurg
- Wardha
- Chandrapur
- Yavatmal
- Buldhana
- Beed
- Osmanabad
- Dhule
- Gondia
- Bhandara

Platform architecture should also support all remaining Maharashtra districts without code changes.

## API Design

### Public APIs
- `GET /api/listings`
- `GET /api/listings/{listingId}`
- `GET /api/cities`
- `GET /api/cities/{citySlug}`
- `GET /api/districts`
- `GET /api/districts/{districtSlug}`
- `GET /api/localities`
- `GET /api/search/suggestions`
- `GET /api/search/map-bounds`

### Listing Submission APIs
- `POST /api/listings`
- `PUT /api/listings/{listingId}`
- `POST /api/listings/{listingId}/images`
- `POST /api/listings/{listingId}/publish`

### Lead APIs
- `POST /api/listings/{listingId}/leads`
- `GET /api/dashboard/leads`
- `PUT /api/dashboard/leads/{leadId}/status`

### Admin APIs
- `GET /api/admin/listings`
- `GET /api/admin/ingestion-runs`
- `GET /api/admin/review-queue`
- `POST /api/admin/listings/{listingId}/approve`
- `POST /api/admin/listings/{listingId}/reject`
- `POST /api/admin/dedupe/merge`

### Ingestion APIs
- `POST /api/admin/ingestion-runs`
- `GET /api/admin/ingestion-runs/{runId}`
- `POST /api/admin/ingestion-sources/validate`

## SEO URL Strategy

Examples:
- `/maharashtra`
- `/maharashtra/mumbai`
- `/maharashtra/pune`
- `/maharashtra/nagpur`
- `/maharashtra/pune/kothrud`
- `/maharashtra/mumbai/pg-accommodation`
- `/maharashtra/nashik/rooms/2-sharing`
- `/maharashtra/thane/commercial/offices`
- `/listing/mumbai-andheri-east-boys-pg-12345`

SEO page requirements:
- City pages
- District pages
- Locality pages
- Category pages
- Filter-combination landing pages for high-intent queries
- Structured data for listings and breadcrumbs

## Scraping and Ingestion Architecture

Only ingest where legally permitted.

### Source Rules
- Respect `robots.txt`
- Respect Terms of Service
- Do not bypass authentication
- Do not collect hidden personal data
- Record source, fetch date, and permission basis

### Ingestion Pipeline
1. Source registry stores approved sources
2. Scheduler creates ingestion runs
3. Fetcher downloads public pages
4. Parser extracts listing candidates
5. Normalizer maps source fields into canonical schema
6. Geocoder enriches city, district, lat, lng where allowed
7. Deduper calculates fingerprints
8. Moderation queue reviews confidence and legal flags
9. Publisher marks listing active

### Compliance Metadata to Store
- Source domain
- Source URL
- Terms review status
- Robots status
- Fetch timestamp
- Parser version
- Legal approval notes

## Data Cleaning Workflow

1. Standardize phone, rent, and deposit formats
2. Normalize categories and sharing labels
3. Map localities to city and district taxonomy
4. Canonicalize amenities
5. Remove duplicate images
6. Detect duplicate listings using title, phone hash, geo, rent, and address similarity
7. Route low-confidence records to admin review
8. Record change history and last seen source timestamps

## Deduplication Strategy

Fingerprint inputs:
- Source URL
- Normalized phone hash
- City + locality + coordinates
- Rent amount
- Title similarity
- Image similarity hash

Confidence tiers:
- `Exact duplicate`
- `Likely duplicate`
- `Needs manual review`

Actions:
- Auto-merge exact duplicates
- Queue likely duplicates for admin review
- Preserve source lineage across merged records

## Deployment Plan

### Phase 1
- App server on one VM or container platform
- MySQL managed instance
- Object storage for images
- Cron-based ingestion jobs

### Phase 2
- Split API and ingestion workers
- Add Redis cache
- Add queue workers
- Add CDN for media and page caching

### Phase 3
- Add search index
- Add map tile optimization
- Add district and city page pre-rendering pipeline

## Scalability Plan

- Normalize geography into reusable tables
- Keep listing source data separate from canonical listings
- Process images asynchronously
- Cache top city, district, and category pages
- Use queue-based ingestion and moderation
- Add read replicas as listing volume grows
- Move heavy search workloads to dedicated search infrastructure when needed

## Migration Plan From RoomRentJaipur

1. Remove Jaipur branding from public UI and metadata
2. Disable and purge seeded Jaipur demo listings
3. Replace city-specific copy with Maharashtra-wide content
4. Add taxonomy tables for state, district, city, and locality
5. Extend listings schema for source tracking, deposit, sharing, furnishing, occupancy, and coordinates
6. Create city and district slugs
7. Add SEO route structure
8. Refactor listing forms to collect canonical location and category data
9. Add admin moderation queue
10. Add legal source registry
11. Implement compliant ingestion worker
12. Add dedupe and source lineage
13. Add map-based search
14. Add media optimization pipeline
15. Roll out city by city starting with top Maharashtra markets

## Suggested Execution Order

Immediate:
- Finish de-Jaipur branding cleanup
- Remove all demo inventory
- Introduce Maharashtra v2 schema

Next:
- Add taxonomy entities and APIs
- Refactor listing form and DTOs
- Add city and district pages

After that:
- Add ingestion, dedupe, moderation, SEO automation, and map search
