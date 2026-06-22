const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RoomRent Maharashtra",
        url: siteUrl(),
        description: "Maharashtra-wide rental marketplace for hostels, PGs, rooms, flats, apartments and commercial spaces",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl()}/search?location={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}
export function placeJsonLd(opts) {
    return {
        "@context": "https://schema.org",
        "@type": "Place",
        name: opts.name,
        description: opts.description,
        url: `${siteUrl()}${opts.url}`,
        ...(opts.containedIn
            ? {
                containedInPlace: {
                    "@type": "Place",
                    name: opts.containedIn
                }
            }
            : {})
    };
}
export function realEstateListingJsonLd(opts) {
    return {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: opts.name,
        description: opts.description,
        url: `${siteUrl()}${opts.url}`,
        offers: {
            "@type": "Offer",
            price: opts.price,
            priceCurrency: opts.priceCurrency ?? "INR",
            availability: "https://schema.org/InStock"
        },
        contentLocation: {
            "@type": "Place",
            name: opts.location,
            address: {
                "@type": "PostalAddress",
                addressLocality: opts.city ?? "",
                addressRegion: opts.state ?? "Maharashtra",
                addressCountry: "IN"
            }
        },
        ...(opts.category ? { category: opts.category } : {}),
        ...(opts.imageUrls?.length ? { image: opts.imageUrls } : {}),
        ...(opts.datePosted ? { datePosted: opts.datePosted } : {})
    };
}
