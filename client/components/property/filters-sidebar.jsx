"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Filter, RotateCcw } from "lucide-react";
const propertyTypes = ["", "PG", "ROOM", "FLAT", "HOSTEL"];
const genders = ["", "BOYS", "GIRLS", "ANY"];
const furnishedOptions = ["", "UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"];
const sharingOptions = ["", "Single Room", "1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing"];
const listedByOptions = ["", "OWNER", "BROKER", "MANAGER"];
const amenities = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup", "AC", "Gym", "CCTV", "Lift"];
const formatLabel = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
export function FiltersSidebar({ filters, onChange, mobile = false, onClose }) {
    const selectedAmenities = filters.amenities || [];
    const toggleAmenity = (amenity) => {
        const nextAmenities = selectedAmenities.includes(amenity)
            ? selectedAmenities.filter((item) => item !== amenity)
            : [...selectedAmenities, amenity];
        onChange({ ...filters, amenities: nextAmenities });
    };
    const hasActiveFilters = !!(filters.location ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.type ||
        filters.gender ||
        filters.furnishedStatus ||
        filters.sharingType ||
        filters.listedByType ||
        (filters.amenities && filters.amenities.length > 0));
    const clearAll = () => onChange({
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
    return (_jsxs("aside", { className: mobile
            ? "sidebar-shell flex h-full min-h-0 flex-col space-y-5 !overflow-y-auto !overflow-x-hidden p-5"
            : "sidebar-shell sticky top-24 h-[calc(100vh-7rem)] w-full min-h-0 space-y-5 !overflow-y-auto !overflow-x-hidden p-5 lg:max-w-[300px] xl:max-w-[312px]", children: [_jsxs("div", { className: "border-b border-[rgba(15,23,42,0.1)] pb-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "sidebar-icon", children: _jsx(Filter, { className: "size-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: "Filters" }), _jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-[var(--rf-cyan)]", children: "Search surface" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [hasActiveFilters ? (_jsx("button", { className: "text-xs font-semibold text-[var(--rf-cyan)] hover:underline", onClick: clearAll, type: "button", children: "Clear all" })) : null, mobile && onClose ? (_jsx("button", { className: "text-xs font-semibold text-[var(--rf-cyan)]", onClick: onClose, type: "button", children: "Done" })) : null] })] }), _jsx("p", { className: "mt-3 text-sm leading-6 text-[var(--rf-muted)]", children: "Refine by city, district, locality, budget, property type, and preference." })] }), [
                {
                    title: "Location",
                    control: (_jsx("input", { className: "form-input", placeholder: "City, district, or locality", value: filters.location || "", onChange: (event) => onChange({ ...filters, location: event.target.value }) }))
                },
                {
                    title: "Price range",
                    control: (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("input", { className: "form-input", placeholder: "Min", inputMode: "numeric", value: filters.minPrice || "", onChange: (event) => onChange({ ...filters, minPrice: event.target.value.replace(/\D/g, "") }) }), _jsx("input", { className: "form-input", placeholder: "Max", inputMode: "numeric", value: filters.maxPrice || "", onChange: (event) => onChange({ ...filters, maxPrice: event.target.value.replace(/\D/g, "") }) })] }))
                },
                {
                    title: "Room type",
                    control: (_jsx("select", { className: "form-select", value: filters.type || "", onChange: (event) => onChange({ ...filters, type: event.target.value }), children: propertyTypes.map((type) => (_jsx("option", { value: type, children: type || "All property types" }, type || "ALL"))) }))
                },
                {
                    title: "Gender",
                    control: (_jsx("select", { className: "form-select", value: filters.gender || "", onChange: (event) => onChange({ ...filters, gender: event.target.value }), children: genders.map((gender) => (_jsx("option", { value: gender, children: gender || "All preferences" }, gender || "ALL"))) }))
                },
                {
                    title: "Furnishing",
                    control: (_jsx("select", { className: "form-select", value: filters.furnishedStatus || "", onChange: (event) => onChange({ ...filters, furnishedStatus: event.target.value }), children: furnishedOptions.map((status) => (_jsx("option", { value: status, children: status ? formatLabel(status) : "Any furnishing" }, status || "ALL"))) }))
                },
                {
                    title: "Sharing type",
                    control: (_jsx("select", { className: "form-select", value: filters.sharingType || "", onChange: (event) => onChange({ ...filters, sharingType: event.target.value }), children: sharingOptions.map((option) => (_jsx("option", { value: option, children: option || "Any sharing" }, option || "ALL"))) }))
                },
                {
                    title: "Listed by",
                    control: (_jsx("select", { className: "form-select", value: filters.listedByType || "", onChange: (event) => onChange({ ...filters, listedByType: event.target.value }), children: listedByOptions.map((option) => (_jsx("option", { value: option, children: option ? formatLabel(option) : "Anyone" }, option || "ALL"))) }))
                }
            ].map((section) => (_jsxs("div", { className: "form-section space-y-3", children: [_jsx("p", { className: "text-sm font-semibold text-[var(--rf-ink)]", children: section.title }), section.control] }, section.title))), _jsxs("div", { className: "form-section space-y-3", children: [_jsx("p", { className: "text-sm font-semibold text-[var(--rf-ink)]", children: "Amenities" }), _jsx("div", { className: "grid gap-2", children: amenities.map((amenity) => (_jsxs("label", { className: "sidebar-link cursor-pointer justify-start", children: [_jsx("input", { type: "checkbox", className: "checkbox checkbox-sm", checked: selectedAmenities.includes(amenity), onChange: () => toggleAmenity(amenity) }), _jsx("span", { className: "text-sm text-[var(--rf-muted)]", children: amenity })] }, amenity))) })] }), _jsxs("button", { className: "landing-secondary-button", type: "button", onClick: clearAll, children: [_jsx(RotateCcw, { className: "size-4" }), "Reset filters"] })] }));
}
