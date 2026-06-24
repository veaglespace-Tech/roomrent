"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyForm } from "@/components/forms/property-form";
import { getPropertyById } from "@/services/property-service";

export default function EditPropertyPage() {
    const params = useParams();
    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const propertyId = params?.id;

    useEffect(() => {
        if (!propertyId) {
            setLoading(false);
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
            .catch(() => setInitialValues(null))
            .finally(() => setLoading(false));
    }, [propertyId]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                    Edit existing listing
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">Edit Property</h1>
                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Update the details, price, or media for this property.
                </p>
            </div>
            
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading property details...</p>
                    </div>
                ) : initialValues && propertyId ? (
                    <PropertyForm initialValues={initialValues} propertyId={propertyId} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="font-medium text-slate-600">Failed to load property details.</p>
                        <p className="mt-1 text-xs text-slate-400">The property might not exist or you might not have permission to edit it.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
