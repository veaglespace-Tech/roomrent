"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { getSavedProperties } from "@/services/user-service";
import { Property } from "@/types";

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadSaved = () => getSavedProperties().then(setProperties).catch(() => setProperties([]));

  useEffect(() => {
    loadSaved();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Saved Properties</h1>
      <p className="mt-2 text-base-content/70">Your shortlisted rooms and PGs.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} onSavedChange={loadSaved} />
        ))}
      </div>
    </div>
  );
}

