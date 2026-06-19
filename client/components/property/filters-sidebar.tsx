"use client";

import { Filter, RotateCcw } from "lucide-react";
import { PropertyFilters, PropertyType, GenderPreference, FurnishedStatus, ListedByType } from "@/types";

interface FiltersSidebarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  mobile?: boolean;
  onClose?: () => void;
}

const propertyTypes: Array<PropertyType | ""> = ["", "PG", "ROOM", "FLAT", "HOSTEL"];
const genders: Array<GenderPreference | ""> = ["", "BOYS", "GIRLS", "ANY"];
const furnishedOptions: Array<FurnishedStatus | ""> = ["", "UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"];
const sharingOptions = ["", "Single Room", "1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing"];
const listedByOptions: Array<ListedByType | ""> = ["", "OWNER", "BROKER", "MANAGER"];
const amenities = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup", "AC", "Gym", "CCTV", "Lift"];

const formatLabel = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function FiltersSidebar({ filters, onChange, mobile = false, onClose }: FiltersSidebarProps) {
  const selectedAmenities = filters.amenities || [];

  const toggleAmenity = (amenity: string) => {
    const nextAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    onChange({ ...filters, amenities: nextAmenities });
  };

  const hasActiveFilters = !!(
    filters.location ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.type ||
    filters.gender ||
    filters.furnishedStatus ||
    filters.sharingType ||
    filters.listedByType ||
    (filters.amenities && filters.amenities.length > 0)
  );

  const clearAll = () =>
    onChange({
      location: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      gender: "",
      furnishedStatus: "",
      sharingType: "",
      listedByType: "",
      amenities: [],
      sortBy: filters.sortBy,
      page: 0,
      size: filters.size
    });

  return (
    <aside
      className={
        mobile
          ? "filter-shell flex h-full min-h-0 flex-col space-y-5 !overflow-y-auto !overflow-x-hidden p-5"
          : "filter-shell sticky top-24 h-[calc(100vh-7rem)] w-full min-h-0 space-y-5 !overflow-y-auto !overflow-x-hidden p-5 lg:max-w-[300px] xl:max-w-[312px]"
      }
    >
      <div className="border-b border-[rgba(15,23,42,0.1)] pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-tile">
              <Filter className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Filters</h3>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-cyan)]">Search surface</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <button className="text-xs font-semibold text-[var(--rf-cyan)] hover:underline" onClick={clearAll} type="button">
                Clear all
              </button>
            ) : null}
            {mobile && onClose ? (
              <button className="text-xs font-semibold text-[var(--rf-cyan)]" onClick={onClose} type="button">
                Done
              </button>
            ) : null}
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--rf-muted)]">Refine by city, district, locality, budget, property type, and preference.</p>
      </div>

      {[
        {
          title: "Location",
          control: (
            <input
              className="form-input"
              placeholder="City, district, or locality"
              value={filters.location || ""}
              onChange={(event) => onChange({ ...filters, location: event.target.value })}
            />
          )
        },
        {
          title: "Price range",
          control: (
            <div className="grid grid-cols-2 gap-3">
              <input className="form-input" placeholder="Min" inputMode="numeric" value={filters.minPrice || ""} onChange={(event) => onChange({ ...filters, minPrice: event.target.value.replace(/\D/g, "") })} />
              <input className="form-input" placeholder="Max" inputMode="numeric" value={filters.maxPrice || ""} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value.replace(/\D/g, "") })} />
            </div>
          )
        },
        {
          title: "Room type",
          control: (
            <select className="form-select" value={filters.type || ""} onChange={(event) => onChange({ ...filters, type: event.target.value as PropertyType | "" })}>
              {propertyTypes.map((type) => (
                <option key={type || "ALL"} value={type}>
                  {type || "All property types"}
                </option>
              ))}
            </select>
          )
        },
        {
          title: "Gender",
          control: (
            <select className="form-select" value={filters.gender || ""} onChange={(event) => onChange({ ...filters, gender: event.target.value as GenderPreference | "" })}>
              {genders.map((gender) => (
                <option key={gender || "ALL"} value={gender}>
                  {gender || "All preferences"}
                </option>
              ))}
            </select>
          )
        },
        {
          title: "Furnishing",
          control: (
            <select className="form-select" value={filters.furnishedStatus || ""} onChange={(event) => onChange({ ...filters, furnishedStatus: event.target.value as FurnishedStatus | "" })}>
              {furnishedOptions.map((status) => (
                <option key={status || "ALL"} value={status}>
                  {status ? formatLabel(status) : "Any furnishing"}
                </option>
              ))}
            </select>
          )
        },
        {
          title: "Sharing type",
          control: (
            <select className="form-select" value={filters.sharingType || ""} onChange={(event) => onChange({ ...filters, sharingType: event.target.value })}>
              {sharingOptions.map((option) => (
                <option key={option || "ALL"} value={option}>
                  {option || "Any sharing"}
                </option>
              ))}
            </select>
          )
        },
        {
          title: "Listed by",
          control: (
            <select className="form-select" value={filters.listedByType || ""} onChange={(event) => onChange({ ...filters, listedByType: event.target.value as ListedByType | "" })}>
              {listedByOptions.map((option) => (
                <option key={option || "ALL"} value={option}>
                  {option ? formatLabel(option) : "Anyone"}
                </option>
              ))}
            </select>
          )
        }
      ].map((section) => (
        <div key={section.title} className="form-section space-y-3">
          <p className="text-sm font-semibold text-[var(--rf-ink)]">{section.title}</p>
          {section.control}
        </div>
      ))}

      <div className="form-section space-y-3">
        <p className="text-sm font-semibold text-[var(--rf-ink)]">Amenities</p>
        <div className="grid gap-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex cursor-pointer items-center gap-3 border border-[rgba(15,23,42,0.1)] px-3 py-2 transition hover:border-[var(--rf-cyan)]">
              <input type="checkbox" className="checkbox checkbox-sm" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
              <span className="text-sm text-[var(--rf-muted)]">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="landing-secondary-button" type="button" onClick={clearAll}>
        <RotateCcw className="size-4" />
        Reset filters
      </button>
    </aside>
  );
}
