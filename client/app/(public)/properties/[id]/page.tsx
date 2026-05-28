"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BedDouble, Check, MapPin, ShieldCheck, UserRound, Wallet } from "lucide-react";
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
            <div className="relative min-h-[360px] overflow-hidden rounded-[22px] border border-base-300/70 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.48)]">
              <Image src={property.imageUrls[0]} alt={property.title} fill className="object-cover" />
            </div>
            <div className="grid gap-4">
              {property.imageUrls.slice(1, 3).map((image) => (
                <div key={image} className="relative min-h-[172px] overflow-hidden rounded-[18px] border border-base-300/70">
                  <Image src={image} alt={property.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <div className="pill-badge border-green-100 bg-green-50 text-green-700">{property.type}</div>
                  {property.category ? <div className="pill-badge border-pink-100 bg-pink-50 text-[#d92f71]">{property.category}</div> : null}
                  {property.sharingType ? <div className="pill-badge">{property.sharingType}</div> : null}
                </div>
                <h1 className="mt-4 text-4xl font-bold">{property.title}</h1>
                <div className="mt-4 flex items-center gap-2 text-base-content/70">
                  <MapPin className="size-4" />
                  {[property.areaLocality, property.city, property.district, property.state].filter(Boolean).join(", ") || property.location}
                </div>
              </div>
              <div className="rounded-[18px] border border-base-300/70 bg-base-200/70 px-6 py-4 text-right">
                <p className="text-3xl font-bold text-[#d92f71]">Rs. {property.price}</p>
                <p className="text-sm text-base-content/60">monthly rent</p>
              </div>
            </div>
            <p className="mt-6 text-base leading-8 text-base-content/75">{property.description}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="surface-card p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-primary" />
                  <div>
                    <p className="font-semibold">Preference</p>
                    <p className="text-sm text-base-content/70">{property.gender}</p>
                  </div>
                </div>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-3">
                  <UserRound className="size-5 text-secondary" />
                  <div>
                    <p className="font-semibold">Listed by</p>
                    <p className="text-sm text-base-content/70">{property.owner.name}</p>
                  </div>
                </div>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="size-5 text-primary" />
                  <div>
                    <p className="font-semibold">Security deposit</p>
                    <p className="text-sm text-base-content/70">{property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request"}</p>
                  </div>
                </div>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-3">
                  <BedDouble className="size-5 text-secondary" />
                  <div>
                    <p className="font-semibold">Furnishing</p>
                    <p className="text-sm text-base-content/70">{property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[18px] border border-base-300/70 bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-base-content/55">Availability</p>
                <p className="mt-2 font-semibold">{property.availabilityStatus || "AVAILABLE"}</p>
              </div>
              <div className="rounded-[18px] border border-base-300/70 bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-base-content/55">Listed by</p>
                <p className="mt-2 font-semibold">{property.listedByType || "OWNER"}</p>
              </div>
              <div className="rounded-[18px] border border-base-300/70 bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-base-content/55">Available from</p>
                <p className="mt-2 font-semibold">{property.availableFromDate || "Immediate"}</p>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 rounded-[14px] border border-base-300 bg-white px-4 py-3">
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
            <p className="text-3xl font-bold text-[#d92f71]">Rs. {property.price}</p>
            <p className="mt-1 text-sm text-base-content/60">Monthly price for this stay</p>
            <div className="mt-5 rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
              Reach the owner directly to confirm availability, security deposit, and move-in timing.
            </div>
            {property.occupancyDetails ? (
              <div className="mt-4 rounded-2xl border border-base-300 px-4 py-3 text-sm text-base-content/70">
                Occupancy: {property.occupancyDetails}
              </div>
            ) : null}
          </div>
          <EnquiryForm propertyId={property.id} />
          <div className="panel p-6">
            <h3 className="text-xl font-semibold">Owner contact summary</h3>
            <p className="mt-4 text-sm text-base-content/70">Name: {property.owner.name}</p>
            <p className="mt-2 text-sm text-base-content/70">Email: {property.owner.email}</p>
            {property.contactNumber ? <p className="mt-2 text-sm text-base-content/70">Phone: {property.contactNumber}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
