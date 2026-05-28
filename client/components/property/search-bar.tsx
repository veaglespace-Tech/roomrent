"use client";

import { FormEvent, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar({ dark = false }: { dark?: boolean }) {
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
    <form
      onSubmit={handleSubmit}
      className={
        dark
          ? "mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-[22px] border border-white/12 bg-[#121b25]/92 p-2 shadow-[0_0_42px_-20px_rgba(255,122,53,0.95)] md:flex-row"
          : "mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-[20px] border border-base-300/70 bg-white/90 p-2 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] md:flex-row"
      }
    >
      <label
        className={
          dark
            ? "flex h-14 flex-1 items-center gap-3 rounded-[16px] bg-white/8 px-4 text-white transition focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-[#ff9f74]/25"
            : "flex h-14 flex-1 items-center gap-3 rounded-[14px] bg-base-200/60 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#ff5c8a]/20"
        }
      >
        <Search className={dark ? "size-4 text-[#ff9f74]" : "size-4 text-[#ef3d81]"} />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter your location"
          className={dark ? "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45" : "w-full bg-transparent text-sm outline-none"}
        />
      </label>
      <button type="submit" className={dark ? "glow-button h-14 shrink-0 px-8" : "btn pink-button h-14 rounded-[14px] px-8 text-sm font-semibold"}>
        <SlidersHorizontal className="relative size-4" />
        Search
      </button>
    </form>
  );
}
