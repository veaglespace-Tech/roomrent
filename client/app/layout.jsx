import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import { websiteJsonLd } from "@/lib/json-ld";
import "./globals.css";
export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
        default: "RoomRent Maharashtra",
        template: "%s | RoomRent Maharashtra"
    },
    description: "Maharashtra-wide rental marketplace for hostels, PGs, rooms, flats, apartments and commercial spaces",
    alternates: {
        canonical: "/"
    },
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: "RoomRent Maharashtra",
        description: "Maharashtra-wide rental marketplace for hostels, PGs, rooms, flats, apartments and commercial spaces",
        url: "/",
        siteName: "RoomRent Maharashtra",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "RoomRent Maharashtra",
        description: "Maharashtra-wide rental marketplace for hostels, PGs, rooms, flats, apartments and commercial spaces"
    }
};
export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover"
};
export default function RootLayout({ children }) {
    return (_jsxs("html", { lang: "en", "data-theme": "roomrent", children: [_jsx("head", { children: _jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(websiteJsonLd()) } }) }), _jsx("body", { children: _jsxs(Providers, { children: [_jsx(Header, {}), _jsx("main", { className: "overflow-x-hidden", children: _jsx(PageTransitionWrapper, { children: children }) }), _jsx(Footer, {})] }) })] }));

}
