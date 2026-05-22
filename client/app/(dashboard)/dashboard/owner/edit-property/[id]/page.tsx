"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/forms/property-form";
import { getPropertyById } from "@/services/property-service";
import { PropertyPayload } from "@/types";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<PropertyPayload | null>(null);
  const propertyId = params?.id;

  useEffect(() => {
    if (!propertyId) {
      return;
    }

    getPropertyById(propertyId)
      .then((property) =>
        setInitialValues({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          type: property.type,
          gender: property.gender,
          amenities: property.amenities,
          imageUrls: property.imageUrls
        })
      )
      .catch(() => setInitialValues(null));
  }, [propertyId]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit Property</h1>
      <div className="mt-8">{initialValues && propertyId ? <PropertyForm initialValues={initialValues} propertyId={propertyId} /> : "Loading..."}</div>
    </div>
  );
}
