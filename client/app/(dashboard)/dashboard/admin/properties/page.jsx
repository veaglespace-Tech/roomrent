"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminProperties, deleteProperty } from "@/services/property-service";
import { AlertTriangle, BadgeCheck, Search, Building, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function ManagePropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    
    // Modal States
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef([]);

    const loadProperties = () => {
        setLoading(true);
        getAdminProperties()
            .then(setProperties)
            .catch(() => setProperties([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProperties();
    }, []);

    useEffect(() => {
        if (loading || properties.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(listRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, properties]);

    const duplicateGroups = Object.values(properties.reduce((groups, property) => {
        const key = `${property.title.trim().toLowerCase()}|${property.location.trim().toLowerCase()}|${property.price}`;
        groups[key] = groups[key] ? [...groups[key], property] : [property];
        return groups;
    }, {})).filter((group) => group.length > 1);

    const filteredProperties = properties.filter((property) => {
        const haystack = `${property.title} ${property.owner?.name || ""} ${property.location} ${property.city ?? ""}`.toLowerCase();
        return haystack.includes(query.toLowerCase().trim());
    });

    const handleDeleteClick = (property) => {
        setSelectedProperty(property);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProperty) return;
        try {
            setDeleteLoading(true);
            await deleteProperty(selectedProperty.id);
            setIsDeleteOpen(false);
            loadProperties();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete the property listing.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6" ref={containerRef}>
            {/* Header / Search Controls */}
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={headerRef}>
                <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Manage Properties</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                    Superadmin view of every published room, PG, and apartment listing.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <label className="flex min-h-[48px] flex-1 items-center gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white">
                        <Search className="size-4 shrink-0 text-indigo-500" />
                        <input 
                            className="w-full bg-transparent text-sm font-medium outline-none text-slate-900 placeholder:text-slate-400" 
                            placeholder="Search title, publisher, location, city..." 
                            value={query} 
                            onChange={(event) => setQuery(event.target.value)} 
                        />
                    </label>
                    {duplicateGroups.length > 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 flex items-center gap-2">
                            <AlertTriangle className="size-4 shrink-0 text-amber-600 animate-pulse" />
                            {duplicateGroups.length} duplicate groups flagged
                        </div>
                    )}
                </div>
            </div>

            {/* Duplicate Candidates panel */}
            {duplicateGroups.length > 0 ? (
                <div className="surface-card space-y-4 p-6 md:p-8 rounded-[24px] border border-amber-200/60 bg-amber-50/30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="size-5 shrink-0 text-amber-600" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Duplicate candidates</h2>
                            <p className="text-sm text-slate-500">
                                These listings share title, location, and price. Review before merging or deleting.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {duplicateGroups.map((group, idx) => (
                            <div key={idx} className="rounded-[22px] border border-amber-200 bg-amber-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-amber-900 truncate">{group[0].title}</p>
                                        <p className="mt-1 text-xs text-amber-800/80 truncate">
                                            {group[0].location} | Rs. {group[0].price}
                                        </p>
                                    </div>
                                    <BadgeCheck className="size-5 shrink-0 text-amber-700" />
                                </div>
                                <div className="mt-4 space-y-2">
                                    {group.map((property) => (
                                        <div key={property.id} className="rounded-[16px] border border-amber-200 bg-white px-4 py-3 text-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-semibold text-slate-900 truncate">
                                                    {property.owner?.name || "Unknown Publisher"}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-500 shrink-0">
                                                    {property.city || property.district || "No city"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Listings Table */}
            <div className="surface-card overflow-hidden p-0 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 bg-slate-50/50">
                        <span className="loading loading-spinner loading-md text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading listings...</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Publisher</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredProperties.map((property, i) => (
                                    <tr key={property.id} ref={el => listRef.current[i] = el} className="hover:bg-slate-50/50 transition duration-150">
                                        <td className="px-6 py-4 max-w-[200px]">
                                            <p className="font-semibold text-slate-900 truncate" title={property.title}>{property.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">{property.type} ({property.category || "General"})</p>
                                        </td>
                                        <td className="px-6 py-4 max-w-[150px]">
                                            <p className="font-medium text-slate-900 truncate" title={property.owner?.name}>{property.owner?.name || "Unknown"}</p>
                                            <p className="text-xs text-slate-500 truncate" title={property.owner?.email}>{property.owner?.email || ""}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium max-w-[150px] truncate" title={property.location}>
                                            {property.location}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">
                                            Rs. {property.price}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 shrink-0">
                                                <Link 
                                                    href={`/dashboard/owner/edit-property/${property.id}`}
                                                    className="flex items-center gap-1 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
                                                    title="Edit property details"
                                                >
                                                    <Pencil className="size-3.5 shrink-0" />
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(property)}
                                                    className="flex items-center gap-1 rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-100"
                                                    title="Delete listing"
                                                >
                                                    <Trash2 className="size-3.5 shrink-0" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center py-12 text-center bg-slate-50">
                        <Building className="mx-auto mb-3 size-12 shrink-0 text-slate-300" />
                        <p className="font-medium text-slate-600">No property listings found.</p>
                    </div>
                )}
            </div>

            {/* Deletion Confirmation Modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="surface-card max-w-md w-full p-6 md:p-8 space-y-6 rounded-[24px] border border-slate-200/60 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-center space-y-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600 mx-auto">
                                <Trash2 className="size-7 shrink-0" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-extrabold text-slate-900">Confirm Property Removal</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    Are you sure you want to permanently delete listing <span className="font-semibold text-rose-600">&quot;{selectedProperty?.title}&quot;</span>?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 font-semibold text-amber-800">
                            ⚠️ Warning: This listing and all tenant callback enquiries, callback numbers, and media assets linked to it will be permanently lost. This action is irreversible.
                        </div>

                        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                            <button 
                                type="button"
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 rounded-[12px] border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-rose-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Removing..." : "Remove Listing"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
