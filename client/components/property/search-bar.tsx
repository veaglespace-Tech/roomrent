"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) {
      params.set("location", location);
    }
    if (type) {
      params.set("type", type);
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-[30px] border border-base-300 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(2,6,23,0.18)] md:flex-row md:items-center md:p-5">
      <label className="input input-bordered flex h-16 flex-1 items-center gap-3 rounded-full border-base-300">
        <Search className="size-4 text-primary" />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City, district, area, or landmark in Maharashtra"
          className="grow"
        />
      </label>
      <select className="select select-bordered h-16 rounded-full border-base-300 md:w-56" value={type} onChange={(event) => setType(event.target.value)}>
        <option value="">Any type</option>
        <option value="PG">PG</option>
        <option value="ROOM">Room</option>
        <option value="FLAT">Flat</option>
        <option value="HOSTEL">Hostel</option>
      </select>
      <button type="submit" className="btn btn-primary h-16 rounded-full px-10">
        Find Home
      </button>
    </form>
  );
}
