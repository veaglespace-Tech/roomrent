"use client";

import { useEffect, useState } from "react";
import { getAdminProperties } from "@/services/property-service";
import { Property } from "@/types";
import { AlertTriangle, BadgeCheck, Search } from "lucide-react";

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAdminProperties().then(setProperties).catch(() => setProperties([]));
  }, []);

  const duplicateGroups = Object.values(
    properties.reduce<Record<string, Property[]>>((groups, property) => {
      const key = `${property.title.trim().toLowerCase()}|${property.location.trim().toLowerCase()}|${property.price}`;
      groups[key] = groups[key] ? [...groups[key], property] : [property];
      return groups;
    }, {})
  ).filter((group) => group.length > 1);

  const filteredProperties = properties.filter((property) => {
    const haystack = `${property.title} ${property.owner.name} ${property.location} ${property.city ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase().trim());
  });

  return (
    <div className="space-y-6">
      <div className="panel p-8">
        <h1 className="text-3xl font-extrabold text-[#111827]">Manage Properties</h1>
        <p className="mt-2 text-sm font-medium text-[#64748b]">Superadmin view of every published property.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-[16px] border border-base-300 bg-base-100 px-4">
            <Search className="size-4 text-[#ef3d81]" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none"
              placeholder="Search title, owner, city"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {duplicateGroups.length} duplicate groups flagged
          </div>
        </div>
      </div>

      {duplicateGroups.length > 0 ? (
        <div className="panel space-y-4 p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Duplicate candidates</h2>
              <p className="text-sm text-[#64748b]">These listings share title, location, and price. Review before publishing or merging.</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {duplicateGroups.map((group) => (
              <div key={group.map((item) => item.id).join("-")} className="rounded-[22px] border border-amber-200 bg-amber-50/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-amber-900">{group[0].title}</p>
                    <p className="mt-1 text-xs text-amber-800/80">{group[0].location} | Rs. {group[0].price}</p>
                  </div>
                  <BadgeCheck className="size-5 text-amber-700" />
                </div>
                <div className="mt-4 space-y-2">
                  {group.map((property) => (
                    <div key={property.id} className="rounded-[16px] border border-amber-200 bg-white px-4 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#111827]">{property.owner.name}</span>
                        <span className="text-xs font-semibold text-[#64748b]">{property.city || property.district || "No city"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="panel overflow-x-auto p-8">
        <table className="table mt-0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Publisher</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.owner.name}</td>
              <td>{property.location}</td>
              <td>Rs. {property.price}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
