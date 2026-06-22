import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MoveRight } from "lucide-react";
import { districtPages, majorCitiesByDistrict } from "@/lib/maharashtra-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";
export function generateStaticParams() {
    return districtPages.map((district) => ({ slug: district.slug }));
}
export function generateMetadata({ params }) {
    return params.then(({ slug }) => {
        const district = districtPages.find((item) => item.slug === slug);
        if (!district) {
            return {};
        }
        return {
            title: `${district.name} rentals`,
            description: `Explore rental demand, city coverage and property categories in ${district.name}, Maharashtra.`
        };
    });
}
export default async function DistrictPage({ params }) {
    const { slug } = await params;
    const district = districtPages.find((item) => item.slug === slug);
    if (!district) {
        notFound();
    }
    const districtCities = majorCitiesByDistrict[district.name] || [];
    const jsonLd = placeJsonLd({
        name: `${district.name} district, Maharashtra`,
        description: `Explore rental demand, city coverage and property categories in ${district.name}, Maharashtra.`,
        url: `/districts/${district.slug}`,
        containedIn: "Maharashtra, India"
    });
    return (_jsxs("section", { className: "page-shell py-10", children: [_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } }), _jsx(Breadcrumbs, { items: [
                    { label: "Districts", href: "/properties" },
                    { label: district.name, href: `/districts/${district.slug}` }
                ] }), _jsxs("div", { className: "soft-card p-8 md:p-10", children: [_jsx("span", { className: "rounded-full bg-[#fff1f4] px-4 py-2 text-sm font-medium text-[#ff385c]", children: "District Guide" }), _jsxs("h1", { className: "mt-5 text-4xl font-bold text-neutral md:text-5xl", children: [district.name, " rental marketplace"] }), _jsxs("p", { className: "mt-4 max-w-3xl text-base leading-8 text-base-content/70", children: ["Explore rooms, PGs, flats and commercial spaces across ", district.name, " district. Browse by city, category or budget."] })] }), _jsx("div", { className: "mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4", children: [
                    { label: "Hostels", type: "HOSTEL" },
                    { label: "PG Accommodation", type: "PG" },
                    { label: "Rooms & Sharing", type: "ROOM" },
                    { label: "Flats & Commercial", type: "FLAT" }
                ].map((item) => (_jsxs(Link, { href: `/search?location=${encodeURIComponent(district.name)}&type=${item.type}`, className: "soft-card p-6 transition hover:border-[#ff385c]/20", children: [_jsx(Building2, { className: "size-5 text-[#ff385c]" }), _jsx("p", { className: "mt-4 text-lg font-semibold text-neutral", children: item.label }), _jsxs("p", { className: "mt-2 text-sm leading-7 text-base-content/68", children: ["Browse ", item.label.toLowerCase(), " options available in ", district.name, "."] })] }, item.label))) }), _jsxs("div", { className: "mt-8 soft-card p-8", children: [_jsxs("h2", { className: "text-2xl font-semibold text-neutral", children: ["Main cities in ", district.name] }), _jsxs("p", { className: "mt-2 text-sm text-base-content/68", children: ["Browse rentals city by city within ", district.name, " district."] }), _jsx("div", { className: "mt-6 flex flex-wrap gap-3", children: districtCities.length > 0 ? (districtCities.map((city) => (_jsx(Link, { href: `/cities/${city.slug}`, className: "rounded-xl border border-base-300/70 bg-white px-4 py-3 text-sm font-medium text-base-content/76 transition hover:border-[#ff385c]/30 hover:text-neutral", children: city.name }, city.slug)))) : (_jsx("span", { className: "text-sm text-base-content/60", children: "City pages will be added for this district." })) })] }), _jsx("div", { className: "mt-8", children: _jsxs(Link, { href: `/search?location=${encodeURIComponent(district.name)}`, className: "btn pink-button rounded-xl px-6", children: ["Browse ", district.name, " Listings", _jsx(MoveRight, { className: "size-4" })] }) })] }));
}
