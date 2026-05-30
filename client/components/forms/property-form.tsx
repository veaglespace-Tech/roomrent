"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ImagePlus, Save, Sparkles } from "lucide-react";
import { createProperty, updateProperty } from "@/services/property-service";
import { AvailabilityStatus, FurnishedStatus, GenderPreference, ListedByType, PropertyPayload, PropertyType } from "@/types";
import { firstZodError, propertySchema } from "@/lib/validation";

const defaultImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
];
const amenityOptions = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup", "Study Desk", "Fridge"];
const categoryOptions = ["Hostels", "PG Accommodation", "Rooms", "Flats / Apartments", "Commercial Properties"];
const sharingOptions = ["Single Room", "1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing"];

interface PropertyFormProps {
  initialValues?: PropertyPayload;
  propertyId?: string;
}

export function PropertyForm({ initialValues, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyPayload>(
    initialValues || {
      title: "",
      description: "",
      price: 0,
      securityDeposit: 0,
      location: "",
      areaLocality: "",
      city: "",
      district: "",
      state: "Maharashtra",
      category: "PG Accommodation",
      sharingType: "",
      furnishedStatus: "SEMI_FURNISHED",
      listedByType: "OWNER",
      contactNumber: "",
      latitude: null,
      longitude: null,
      availabilityStatus: "AVAILABLE",
      availableFromDate: "",
      occupancyDetails: "",
      listingSource: "Owner Submission",
      listingUrl: "",
      type: "PG",
      gender: "ANY",
      amenities: ["WiFi", "Laundry"],
      imageUrls: defaultImages
    }
  );
  const [imagesText, setImagesText] = useState((initialValues?.imageUrls || defaultImages).join("\n"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const imageUrls = imagesText.split("\n").map((item) => item.trim()).filter(Boolean);
    if (imageUrls.length === 0) {
      setError("Add at least one image URL.");
      return;
    }
    if (form.amenities.length === 0) {
      setError("Select at least one amenity.");
      return;
    }
    const parsed = propertySchema.safeParse({ ...form, imageUrls });
    if (!parsed.success) {
      setError(firstZodError(parsed.error));
      return;
    }

    try {
      setLoading(true);
      setError("");
      const payload = { ...form, imageUrls };
      if (propertyId) {
        await updateProperty(propertyId, payload);
      } else {
        await createProperty(payload);
      }
      router.push("/dashboard/owner/my-listings");
    } catch {
      setError("Unable to save property. Check required fields and permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/70 pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef3d81]">Listing details</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral">{propertyId ? "Update property" : "Publish a property"}</h2>
        </div>
        <div className="icon-tile">
          <Sparkles className="size-5" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <input className="form-input" placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="form-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="form-input" type="number" placeholder="Monthly rent" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input className="form-input" type="number" placeholder="Security deposit" value={form.securityDeposit ?? 0} onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })} />
        <input className="form-input" placeholder="Area / Locality" value={form.areaLocality || ""} onChange={(e) => setForm({ ...form, areaLocality: e.target.value })} />
        <input className="form-input" placeholder="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="form-input" placeholder="District" value={form.district || ""} onChange={(e) => setForm({ ...form, district: e.target.value })} />
        <input className="form-input" placeholder="State" value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <select className="form-select" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}>
          {["PG", "ROOM", "FLAT", "HOSTEL"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select className="form-select" value={form.sharingType || ""} onChange={(e) => setForm({ ...form, sharingType: e.target.value })}>
          <option value="">Select sharing type</option>
          {sharingOptions.map((sharing) => <option key={sharing} value={sharing}>{sharing}</option>)}
        </select>
        <select className="form-select" value={form.furnishedStatus || "SEMI_FURNISHED"} onChange={(e) => setForm({ ...form, furnishedStatus: e.target.value as FurnishedStatus })}>
          {["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
        </select>
        <select className="form-select" value={form.listedByType || "OWNER"} onChange={(e) => setForm({ ...form, listedByType: e.target.value as ListedByType })}>
          {["OWNER", "BROKER", "MANAGER"].map((listedBy) => <option key={listedBy} value={listedBy}>{listedBy}</option>)}
        </select>
        <input className="form-input" placeholder="Contact number" value={form.contactNumber || ""} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <select className="form-select" value={form.availabilityStatus || "AVAILABLE"} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value as AvailabilityStatus })}>
          {["AVAILABLE", "OCCUPIED", "UPCOMING"].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <input className="form-input" placeholder="Available from date" value={form.availableFromDate || ""} onChange={(e) => setForm({ ...form, availableFromDate: e.target.value })} />
        <select className="form-select md:col-span-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as GenderPreference })}>
          {["ANY", "BOYS", "GIRLS"].map((gender) => <option key={gender} value={gender}>{gender}</option>)}
        </select>
        <input className="form-input" type="number" step="0.000001" placeholder="Latitude" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })} />
        <input className="form-input" type="number" step="0.000001" placeholder="Longitude" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })} />
        <input className="form-input md:col-span-2" placeholder="Occupancy details" value={form.occupancyDetails || ""} onChange={(e) => setForm({ ...form, occupancyDetails: e.target.value })} />
        <input className="form-input" placeholder="Listing source" value={form.listingSource || ""} onChange={(e) => setForm({ ...form, listingSource: e.target.value })} />
        <input className="form-input" placeholder="Listing URL" value={form.listingUrl || ""} onChange={(e) => setForm({ ...form, listingUrl: e.target.value })} />
      </div>
      <div className="form-section space-y-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-base-content/80"><Sparkles className="size-4 text-[#ef3d81]" /> Amenities</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenityOptions.map((amenity) => {
            const checked = form.amenities.includes(amenity);
            return (
              <label key={amenity} className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition ${checked ? "border-[#ff5c8a]/35 bg-[#fff1f4] text-neutral" : "border-base-300 bg-white hover:border-[#ff5c8a]/25"}`}>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={checked}
                  onChange={() =>
                    setForm({
                      ...form,
                      amenities: checked
                        ? form.amenities.filter((item) => item !== amenity)
                        : [...form.amenities, amenity]
                    })
                  }
                />
                <span className="text-sm">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
      <textarea className="form-textarea min-h-40" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/80"><ImagePlus className="size-4 text-[#ef3d81]" /> Image URLs</span>
        <textarea className="form-textarea min-h-32" placeholder="One image URL per line" value={imagesText} onChange={(e) => setImagesText(e.target.value)} />
      </label>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <button type="submit" className="glow-button" disabled={loading}>
        <Save className="relative size-4" />
        {loading ? "Saving..." : propertyId ? "Update Property" : "Publish Property"}
      </button>
    </form>
  );
}
