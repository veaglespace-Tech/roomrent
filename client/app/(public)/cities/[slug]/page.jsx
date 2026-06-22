import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPinned, MoveRight } from "lucide-react";
import { categoryBlueprint, cityPages, localityPages, districtPages } from "@/lib/maharashtra-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";
export function generateStaticParams() {
    return cityPages.map((city) => ({ slug: city.slug }));
}
export function generateMetadata({ params }) {
    return params.then(({ slug }) => {
        const city = cityPages.find((item) => item.slug === slug);
        if (!city) {
            return {};
        }
        return {
            title: `Rentals in ${city.city}`,
            description: `${city.highlight}. Explore city-level rental demand, localities and property categories in ${city.city}, Maharashtra.`
        };
    });
}
export default async function CityPage({ params }) {
    const { slug } = await params;
    const city = cityPages.find((item) => item.slug === slug);
    if (!city) {
        notFound();
    }
    const cityLocalities = localityPages.filter((item) => item.citySlug === city.slug).slice(0, 6);
    const districtSlug = districtPages.find((d) => d.name === city.district)?.slug || "";
    const jsonLd = placeJsonLd({
        name: `${city.city}, Maharashtra`,
        description: `${city.highlight}. Explore rental demand, localities and property categories in ${city.city}.`,
        url: `/cities/${city.slug}`,
        containedIn: `${city.district} district, Maharashtra`
    });
    return (_jsxs("section", { className: "page-shell py-10", children: [_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } }), _jsx(Breadcrumbs, { items: [
                    { label: "Cities", href: "/properties" },
                    { label: city.city, href: `/cities/${city.slug}` }
                ] }), _jsxs("div", { className: "soft-card p-8 md:p-10", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-base-content/70", children: [_jsx("span", { className: "rounded-full bg-[#fff1f4] px-4 py-2 text-[#ff385c]", children: "City Page" }), _jsxs("span", { className: "rounded-full border border-base-300/70 px-4 py-2", children: [city.district, " district"] })] }), _jsxs("h1", { className: "mt-5 text-4xl font-bold text-neutral md:text-5xl", children: ["Rentals in ", city.city, ", Maharashtra"] }), _jsxs("p", { className: "mt-4 max-w-3xl text-base leading-8 text-base-content/72", children: [city.highlight, ". Browse rooms, PGs, flats and commercial spaces across ", city.city, " with city-level search filters."] }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsxs(Link, { href: `/search?location=${encodeURIComponent(city.city)}`, className: "btn pink-button rounded-xl px-6", children: ["Search ", city.city, _jsx(MoveRight, { className: "size-4" })] }), _jsxs(Link, { href: `/districts/${districtSlug}`, className: "btn rounded-xl border border-base-300 bg-white px-6", children: [city.district, " District"] })] }), _jsx("div", { className: "mt-8 grid gap-5 md:grid-cols-3", children: categoryBlueprint.slice(0, 3).map((group) => (_jsxs(Link, { href: `/search?location=${encodeURIComponent(city.city)}&type=${group.label === "Hostels" ? "HOSTEL" : group.label === "PG Accommodation" ? "PG" : "ROOM"}`, className: "rounded-[20px] bg-base-200/60 p-5 transition hover:bg-base-200/90", children: [_jsx("p", { className: "font-semibold text-neutral", children: group.label }), _jsx("p", { className: "mt-2 text-sm leading-7 text-base-content/68", children: group.items.join(", ") })] }, group.label))) })] }), cityLocalities.length > 0 ? (_jsxs("div", { className: "mt-8 soft-card p-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Building2, { className: "size-5 text-[#ff385c]" }), _jsxs("h2", { className: "text-2xl font-semibold text-neutral", children: ["Featured localities in ", city.city] })] }), _jsxs("p", { className: "mt-2 text-sm text-base-content/68", children: ["Explore rental demand by locality for more targeted results in ", city.city, "."] }), _jsx("div", { className: "mt-6 flex flex-wrap gap-3", children: cityLocalities.map((locality) => (_jsx(Link, { href: `/localities/${locality.slug}`, className: "rounded-xl border border-base-300/70 bg-white px-4 py-3 text-sm font-medium text-base-content/76 transition hover:border-[#ff385c]/30 hover:text-neutral", children: locality.name }, locality.slug))) })] })) : null, _jsx("div", { className: "mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
                    { title: "Browse live listings", icon: Building2, desc: `Active rental listings in ${city.city}` },
                    { title: "Map-based locality search", icon: MapPinned, desc: "Visual neighbourhood search" },
                    { title: "Owner and broker onboarding", icon: Building2, desc: "Publish your property directly" },
                    { title: "Lead capture and contact flow", icon: Building2, desc: "Connect with owners instantly" },
                    { title: "Commercial and residential options", icon: Building2, desc: "Shops, offices and homes" },
                    { title: "City-specific search filters", icon: MapPinned, desc: `Filters tuned for ${city.city}` }
                ].map((item) => (_jsxs("div", { className: "soft-card p-6", children: [_jsx(item.icon, { className: "size-5 text-[#ff385c]" }), _jsx("p", { className: "mt-4 text-lg font-semibold text-neutral", children: item.title }), _jsx("p", { className: "mt-2 text-sm text-base-content/60", children: item.desc })] }, item.title))) }), _jsx("div", { className: "mt-8", children: _jsxs(Link, { href: `/search?location=${encodeURIComponent(city.city)}`, className: "btn pink-button rounded-xl px-6", children: ["Explore Properties in ", city.city, _jsx(MoveRight, { className: "size-4" })] }) })] }));
}
