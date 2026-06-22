"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { getSavedProperties } from "@/services/user-service";
export default function SavedPropertiesPage() {
    const [properties, setProperties] = useState([]);
    const loadSaved = () => getSavedProperties().then(setProperties).catch(() => setProperties([]));
    useEffect(() => {
        loadSaved();
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Saved Properties" }), _jsx("p", { className: "mt-2 text-base-content/70", children: "Your shortlisted rooms and PGs." }), _jsx("div", { className: "mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: properties.map((property) => (_jsx(PropertyCard, { property: property, onSavedChange: loadSaved }, property.id))) })] }));
}
