"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createProperty, updateProperty } from "@/services/property-service";
import { GenderPreference, PropertyPayload, PropertyType } from "@/types";

const defaultImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
];
const amenityOptions = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup", "Study Desk", "Fridge"];

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
      location: "",
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
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <input className="input input-bordered w-full" placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="input input-bordered w-full" type="number" placeholder="Monthly rent" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <select className="select select-bordered w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}>
          {["PG", "ROOM", "FLAT", "HOSTEL"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select className="select select-bordered w-full md:col-span-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as GenderPreference })}>
          {["ANY", "BOYS", "GIRLS"].map((gender) => <option key={gender} value={gender}>{gender}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Amenities</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenityOptions.map((amenity) => {
            const checked = form.amenities.includes(amenity);
            return (
              <label key={amenity} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${checked ? "border-primary bg-primary/5" : "border-base-300"}`}>
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
      <textarea className="textarea textarea-bordered min-h-40 w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="textarea textarea-bordered min-h-32 w-full" placeholder="One image URL per line" value={imagesText} onChange={(e) => setImagesText(e.target.value)} />
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <button type="submit" className="btn btn-primary rounded-full" disabled={loading}>
        {loading ? "Saving..." : propertyId ? "Update Property" : "Publish Property"}
      </button>
    </form>
  );
}
