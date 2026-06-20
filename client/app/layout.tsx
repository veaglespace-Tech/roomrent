import type { Metadata } from "next";
import type { Viewport } from "next";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { websiteJsonLd } from "@/lib/json-ld";
import "./globals.css";

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="roomrent">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
