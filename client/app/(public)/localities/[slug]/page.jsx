import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPinned, MoveRight } from "lucide-react";
import { localityPages } from "@/lib/maharashtra-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";
export function generateStaticParams() {
    return localityPages.map((locality) => ({ slug: locality.slug }));
}
export function generateMetadata({ params }) {
    return params.then(({ slug }) => {
        const locality = localityPages.find((item) => item.slug === slug);
        if (!locality) {
            return {};
        }
        return {
            title: `${locality.name} rentals`,
            description: `Browse rentals in ${locality.name}, ${locality.city}, ${locality.district}. ${locality.highlight}.`
        };
    });
}
export default async function LocalityPage({ params }) {
    const { slug } = await params;
    const locality = localityPages.find((item) => item.slug === slug);
    if (!locality) {
        notFound();
    }
    const jsonLd = placeJsonLd({
        name: `${locality.name}, ${locality.city}`,
        description: `${locality.highlight}. Browse rentals in ${locality.name}, ${locality.city}, Maharashtra.`,
        url: `/localities/${locality.slug}`,
        containedIn: `${locality.city}, ${locality.district} district, Maharashtra`
    });
    return (_jsxs("section", { className: "page-shell py-10", children: [_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } }), _jsx(Breadcrumbs, { items: [
                    { label: locality.city, href: `/cities/${locality.citySlug}` },
                    { label: locality.name, href: `/localities/${locality.slug}` }
                ] }), _jsxs("div", { className: "soft-card p-8 md:p-10", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-base-content/70", children: [_jsx("span", { className: "rounded-full bg-[#fff1f4] px-4 py-2 text-[#ff385c]", children: "Locality Page" }), _jsx("span", { className: "rounded-full border border-base-300/70 px-4 py-2", children: locality.city }), _jsx("span", { className: "rounded-full border border-base-300/70 px-4 py-2", children: locality.district })] }), _jsxs("h1", { className: "mt-5 text-4xl font-bold text-neutral md:text-5xl", children: ["Rentals in ", locality.name] }), _jsxs("p", { className: "mt-4 max-w-3xl text-base leading-8 text-base-content/72", children: [locality.highlight, ". Browse rooms, PGs, flats and commercial spaces in ", locality.name, ", ", locality.city, "."] })] }), _jsx("div", { className: "mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
                    { title: "City context", copy: locality.city, icon: Building2, href: `/cities/${locality.citySlug}` },
                    { title: "District context", copy: locality.district, icon: MapPinned, href: `/districts/${locality.districtSlug}` },
                    { title: "Search action", copy: "Browse live listings in this locality", icon: MoveRight, href: `/search?location=${encodeURIComponent(locality.name)}` }
                ].map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(Link, { href: item.href, className: "soft-card p-6 transition hover:border-[#ff385c]/20", children: [_jsx(Icon, { className: "size-5 text-[#ff385c]" }), _jsx("p", { className: "mt-4 text-lg font-semibold text-neutral", children: item.title }), _jsx("p", { className: "mt-2 text-sm leading-7 text-base-content/68", children: item.copy })] }, item.title));
                }) }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsxs(Link, { href: `/search?location=${encodeURIComponent(locality.name)}`, className: "btn pink-button rounded-xl px-6", children: ["Search ", locality.name, _jsx(MoveRight, { className: "size-4" })] }), _jsxs(Link, { href: `/cities/${locality.citySlug}`, className: "btn rounded-xl border border-base-300 bg-white px-6", children: [locality.city, " City Page"] }), _jsxs(Link, { href: `/districts/${locality.districtSlug}`, className: "btn rounded-xl border border-base-300 bg-white px-6", children: [locality.district, " District"] })] })] }));
}
