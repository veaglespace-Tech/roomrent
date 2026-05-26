"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) {
      params.set("location", location);
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-3 md:flex-row">
      <label className="flex h-14 flex-1 items-center gap-3 rounded-xl border border-base-300/70 bg-white px-4 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.35)]">
        <Search className="size-4 text-base-content/45" />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter your location"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      <button type="submit" className="btn pink-button h-14 rounded-xl px-8 text-sm font-semibold">
        Search
      </button>
    </form>
  );
}
