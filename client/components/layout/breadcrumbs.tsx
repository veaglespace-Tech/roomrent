import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-[var(--rf-muted)]">
        <Link href="/" className="inline-flex items-center gap-1.5 border border-[rgba(21,197,206,0.28)] px-2.5 py-1 transition hover:border-[var(--rf-cyan)] hover:text-[var(--rf-cyan)]">
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-[rgba(21,197,206,0.4)]" />
              {isLast ? (
                <span className="border border-[rgba(21,197,206,0.28)] px-2.5 py-1 text-[var(--rf-ink)]">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="border border-transparent px-2.5 py-1 transition hover:border-[rgba(21,197,206,0.28)] hover:text-[var(--rf-cyan)]">
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
