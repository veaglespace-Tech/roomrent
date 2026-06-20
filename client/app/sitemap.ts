import type { MetadataRoute } from "next";
import { cityPages, districtPages, localityPages } from "@/lib/maharashtra-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = [
    "/",
    "/properties",
    "/search",
    "/compare",
    "/contact",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password"
  ];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7
    })),
    ...cityPages.map((city) => ({
      url: `${baseUrl}/cities/${city.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...districtPages.map((district) => ({
      url: `${baseUrl}/districts/${district.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75
    })),
    ...localityPages.map((locality) => ({
      url: `${baseUrl}/localities/${locality.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.72
    }))
  ];
}
