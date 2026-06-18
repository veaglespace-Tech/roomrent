"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center reveal-up">
      <div className="border border-[var(--rf-cyan)] bg-[rgba(15,118,110,0.08)] p-4 text-[var(--rf-cyan)]">
        <AlertCircle className="size-10" />
      </div>
      <h1 className="mt-6 text-4xl font-bold md:text-5xl">404 - Page Not Found</h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[var(--rf-muted)]">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8">
        <Link href="/" className="landing-primary-button">
          <Home className="size-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
