"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { getPropertyById } from "@/services/property-service";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Property } from "@/types";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const propertyId = params?.id;

  useEffect(() => {
    if (!propertyId) {
      return;
    }

    getPropertyById(propertyId).then(setProperty).catch(() => setProperty(null));
  }, [propertyId]);

  if (!property) {
    return <div className="page-shell py-20">Loading property details...</div>;
  }

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-[32px]">
              <Image src={property.imageUrls[0]} alt={property.title} fill className="object-cover" />
            </div>
            <div className="grid gap-4">
              {property.imageUrls.slice(1, 3).map((image) => (
                <div key={image} className="relative min-h-[172px] overflow-hidden rounded-[28px]">
                  <Image src={image} alt={property.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="badge badge-outline border-primary/30 text-primary">{property.type}</div>
                <h1 className="mt-4 text-4xl font-bold">{property.title}</h1>
                <div className="mt-4 flex items-center gap-2 text-base-content/70">
                  <MapPin className="size-4" />
                  {property.location}
                </div>
              </div>
              <div className="rounded-[28px] bg-base-200 px-6 py-4 text-right">
                <p className="text-3xl font-bold text-primary">Rs. {property.price}</p>
                <p className="text-sm text-base-content/60">monthly rent</p>
              </div>
            </div>
            <p className="mt-6 text-base leading-8 text-base-content/75">{property.description}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-base-300 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-primary" />
                  <div>
                    <p className="font-semibold">Preference</p>
                    <p className="text-sm text-base-content/70">{property.gender}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-base-300 p-4">
                <div className="flex items-center gap-3">
                  <UserRound className="size-5 text-secondary" />
                  <div>
                    <p className="font-semibold">Listed by</p>
                    <p className="text-sm text-base-content/70">{property.owner.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 rounded-2xl border border-base-300 px-4 py-3">
                    <Check className="size-4 text-primary" />
                    <span className="text-sm text-base-content/80">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="panel p-6">
            <p className="text-3xl font-bold text-primary">Rs. {property.price}</p>
            <p className="mt-1 text-sm text-base-content/60">Monthly price for this stay</p>
            <div className="mt-5 rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
              Reach the owner directly to confirm availability, security deposit, and move-in timing.
            </div>
          </div>
          <EnquiryForm propertyId={property.id} />
          <div className="panel p-6">
            <h3 className="text-xl font-semibold">Owner contact summary</h3>
            <p className="mt-4 text-sm text-base-content/70">Name: {property.owner.name}</p>
            <p className="mt-2 text-sm text-base-content/70">Email: {property.owner.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
