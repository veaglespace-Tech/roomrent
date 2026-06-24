import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ items }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${siteUrl}${item.href}`
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--rf-muted)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rf-line)] bg-slate-900/40 px-3 py-1 font-semibold text-slate-300 hover:border-indigo-500/30 hover:text-indigo-400 hover:scale-[1.02] active:scale-95 transition-all duration-200 backdrop-blur-md"
        >
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.href} className="inline-flex items-center gap-2">
              <ChevronRight className="size-3.5 text-slate-600" />
              {isLast ? (
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-bold text-indigo-400 backdrop-blur-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-full border border-[var(--rf-line)] bg-slate-900/40 px-3 py-1 font-semibold text-slate-300 hover:border-indigo-500/30 hover:text-indigo-400 hover:scale-[1.02] active:scale-95 transition-all duration-200 backdrop-blur-md"
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
