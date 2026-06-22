"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/forms/property-form";
import { getPropertyById } from "@/services/property-service";
export default function EditPropertyPage() {
    const params = useParams();
    const [initialValues, setInitialValues] = useState(null);
    const propertyId = params?.id;
    useEffect(() => {
        if (!propertyId) {
            return;
        }
        getPropertyById(propertyId)
            .then((property) => setInitialValues({
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            type: property.type,
            gender: property.gender,
            amenities: property.amenities,
            imageUrls: property.imageUrls
        }))
            .catch(() => setInitialValues(null));
    }, [propertyId]);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Edit Property" }), _jsx("div", { className: "mt-8", children: initialValues && propertyId ? _jsx(PropertyForm, { initialValues: initialValues, propertyId: propertyId }) : "Loading..." })] }));
}
