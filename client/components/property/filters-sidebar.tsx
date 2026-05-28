"use client";

import { Filter, RotateCcw } from "lucide-react";
import { PropertyFilters, PropertyType, GenderPreference } from "@/types";

interface FiltersSidebarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

const propertyTypes: Array<PropertyType | ""> = ["", "PG", "ROOM", "FLAT", "HOSTEL"];
const genders: Array<GenderPreference | ""> = ["", "BOYS", "GIRLS", "ANY"];
const amenities = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup"];

export function FiltersSidebar({ filters, onChange }: FiltersSidebarProps) {
  const selectedAmenities = filters.amenities || [];

  const toggleAmenity = (amenity: string) => {
    const nextAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    onChange({ ...filters, amenities: nextAmenities });
  };

  return (
    <aside className="filter-shell sticky top-24 h-fit space-y-5 p-5">
      <div className="border-b border-base-300 pb-4">
        <div className="flex items-center gap-3">
          <div className="icon-tile">
            <Filter className="size-5" />
          </div>
          <h3 className="text-lg font-extrabold text-[#111827]">Filters</h3>
        </div>
        <p className="text-sm font-medium leading-6 text-[#64748b]">Refine by city, district, locality, budget, property type, and preference.</p>
      </div>

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Location</p>
        <input
          className="form-input"
          placeholder="City, district, or locality"
          value={filters.location || ""}
          onChange={(event) => onChange({ ...filters, location: event.target.value })}
        />
      </div>

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Price range</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="form-input"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
          />
          <input
            className="form-input"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
          />
        </div>
      </div>

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Room type</p>
        <select
          className="form-select"
          value={filters.type || ""}
          onChange={(event) => onChange({ ...filters, type: event.target.value as PropertyType | "" })}
        >
          {propertyTypes.map((type) => (
            <option key={type || "ALL"} value={type}>
              {type || "All Property Types"}
            </option>
          ))}
        </select>
      </div>

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Gender</p>
        <select
          className="form-select"
          value={filters.gender || ""}
          onChange={(event) => onChange({ ...filters, gender: event.target.value as GenderPreference | "" })}
        >
          {genders.map((gender) => (
            <option key={gender || "ALL"} value={gender}>
              {gender || "All Preferences"}
            </option>
          ))}
        </select>
      </div>

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-base-content/80">Amenities</p>
        <div className="space-y-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="label cursor-pointer justify-start gap-3 rounded-[14px] px-2 transition duration-300 hover:bg-white hover:shadow-[0_14px_28px_-24px_rgba(15,23,42,0.42)]">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <span className="label-text">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="landing-secondary-button" onClick={() => onChange({ amenities: [] })}>
        <RotateCcw className="size-4" />
        Reset Filters
      </button>
    </aside>
  );
}
