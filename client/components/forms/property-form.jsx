"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { BedDouble, ImagePlus, MapPin, Save, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";
import api from "@/services/api";
import { createProperty, updateProperty } from "@/services/property-service";
import { getStoredAuthRole } from "@/lib/auth-session";
import { firstZodError, propertySchema } from "@/lib/validation";
import { majorCitiesByDistrict, maharashtraDistricts } from "@/lib/maharashtra-data";
import gsap from "gsap";

const amenityOptions = ["WiFi", "Meals", "Housekeeping", "Attached Bath", "Laundry", "Parking", "Balcony", "Power Backup", "Study Desk", "Fridge"];
const categoryOptions = ["Hostels", "PG Accommodation", "Rooms", "Flats / Apartments", "Commercial Properties"];
const sharingOptions = ["Single Room", "1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing"];

const wizardSteps = [
    { id: 1, title: "Basic details", hint: "What is this property?" },
    { id: 2, title: "Location", hint: "Where is it located?" },
    { id: 3, title: "Pricing", hint: "Rent, deposit and availability" },
    { id: 4, title: "Photos & amenities", hint: "Make it look complete" }
];

export function PropertyForm({ initialValues, propertyId }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initialValues || {
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
        imageUrls: []
    });
    
    const [imagesText, setImagesText] = useState((initialValues?.imageUrls || []).join("\n"));
    const [stepErrors, setStepErrors] = useState({ 1: [], 2: [], 3: [], 4: [] });
    const [submitError, setSubmitError] = useState("");
    const [draftNotice, setDraftNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const formRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }, formRef);
        return () => ctx.revert();
    }, []);

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadError("");
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);
            try {
                const { data } = await api.post("/uploads", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (data && data.url) {
                    uploadedUrls.push(data.url);
                }
            }
            catch (err) {
                console.error("Upload error", err);
                setUploadError(err?.response?.data?.message || "Failed to upload one or more images.");
            }
        }
        if (uploadedUrls.length > 0) {
            setImagesText((current) => {
                const existing = current.trim();
                const fresh = uploadedUrls.join("\n");
                return existing ? `${existing}\n${fresh}` : fresh;
            });
        }
        setUploading(false);
        event.target.value = "";
    };

    const cityOptions = form.district ? (majorCitiesByDistrict[form.district] || []) : [];
    const storageKey = propertyId ? `roomrent-property-draft:${propertyId}` : "roomrent-property-draft:new";

    const getStepFieldErrors = (targetStep) => {
        const errors = {};
        if (targetStep === 1) {
            if (!form.title.trim()) errors.title = "Property title is required.";
            if (!form.description.trim()) {
                errors.description = "Description is required.";
            }
            else if (form.description.trim().length < 20) {
                errors.description = "Description should be at least 20 characters.";
            }
            if (!form.type) errors.type = "Choose a property type.";
            if (!form.category) errors.category = "Choose a category.";
            if (!form.listedByType) errors.listedByType = "Choose who is listing this property.";
        }
        if (targetStep === 2) {
            if (!form.location.trim()) errors.location = "Location is required.";
            if (!String(form.district || "").trim()) errors.district = "District is required.";
            if (!String(form.city || "").trim()) errors.city = "City is required.";
            if (!String(form.state || "").trim()) errors.state = "State is required.";
        }
        if (targetStep === 3) {
            if (!(form.price > 0)) errors.price = "Monthly rent must be greater than 0.";
            if (!form.availabilityStatus) errors.availabilityStatus = "Availability status is required.";
            if (!form.gender) errors.gender = "Choose a gender preference.";
            if (!String(form.availableFromDate || "").trim()) errors.availableFromDate = "Available from date is required.";
        }
        if (targetStep === 4) {
            if (form.amenities.length === 0) errors.amenities = "Select at least one amenity.";
            if (imagesText.split("\n").map((item) => item.trim()).filter(Boolean).length === 0) errors.imageUrls = "Add at least one image URL.";
        }
        return errors;
    };

    const getStepMessages = (targetStep) => Object.values(getStepFieldErrors(targetStep)).filter((message) => Boolean(message));
    const stepFieldErrors = getStepFieldErrors(step);
    const completedStepCount = wizardSteps.filter((item) => getStepMessages(item.id).length === 0).length;
    const completionPercent = Math.round((completedStepCount / wizardSteps.length) * 100);

    const persistDraft = (showFeedback = false) => {
        if (typeof window === "undefined") return;
        const snapshot = { form, imagesText, step };
        window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
        if (showFeedback) {
            setDraftNotice("Draft saved locally.");
        }
    };

    useEffect(() => {
        if (initialValues || typeof window === "undefined") return;
        const savedDraft = window.localStorage.getItem(storageKey);
        if (!savedDraft) return;
        try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.form) setForm((current) => ({ ...current, ...parsed.form }));
            if (typeof parsed.imagesText === "string") setImagesText(parsed.imagesText);
            if (parsed.step) setStep(parsed.step);
        }
        catch {
            window.localStorage.removeItem(storageKey);
        }
    }, [initialValues, storageKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const timeout = window.setTimeout(() => {
            persistDraft(false);
        }, 300);
        return () => window.clearTimeout(timeout);
    }, [form, imagesText, step, storageKey]);

    useEffect(() => {
        if (!draftNotice || typeof window === "undefined") return;
        const timeout = window.setTimeout(() => setDraftNotice(""), 2200);
        return () => window.clearTimeout(timeout);
    }, [draftNotice]);

    useEffect(() => {
        if (stepErrors[step].length === 0) return;
        const messages = getStepMessages(step);
        if (messages.length === 0) {
            setStepErrors((current) => ({ ...current, [step]: [] }));
        }
    }, [step, form, imagesText, stepErrors]);

    const clearDraft = () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(storageKey);
        }
    };

    const currentStepMessages = stepErrors[step];
    const previewImage = imagesText.split("\n").map((item) => item.trim()).filter(Boolean)[0];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step !== 4) {
            const messages = getStepMessages(step);
            if (messages.length > 0) {
                setSubmitError("");
                setStepErrors((current) => ({ ...current, [step]: messages }));
                return;
            }
            setStepErrors((current) => ({ ...current, [step]: [] }));
            setStep((current) => (current < 4 ? (current + 1) : current));
            return;
        }
        
        const imageUrls = imagesText.split("\n").map((item) => item.trim()).filter(Boolean);
        if (imageUrls.length === 0) {
            setSubmitError("");
            setStepErrors((current) => ({ ...current, 4: ["Add at least one image URL."] }));
            return;
        }
        if (form.amenities.length === 0) {
            setSubmitError("");
            setStepErrors((current) => ({ ...current, 4: ["Select at least one amenity."] }));
            return;
        }
        const parsed = propertySchema.safeParse({ ...form, imageUrls });
        if (!parsed.success) {
            setSubmitError("");
            setStepErrors((current) => ({ ...current, 4: [firstZodError(parsed.error)] }));
            return;
        }
        try {
            setLoading(true);
            setSubmitError("");
            const payload = { ...form, imageUrls };
            if (propertyId) {
                await updateProperty(propertyId, payload);
            } else {
                await createProperty(payload);
            }
            clearDraft();
            const role = getStoredAuthRole();
            if (role === "ADMIN") {
                router.push("/dashboard/admin/properties");
            } else {
                router.push("/dashboard/owner/my-listings");
            }
        }
        catch (err) {
            setSubmitError(err?.response?.data?.message || "Unable to save property. Check required fields, subscription plan and permissions.");
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-500">Listing details</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900 font-heading">{propertyId ? "Update property" : "Publish a property"}</h2>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Sparkles className="size-5 shrink-0" />
                </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Progress</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{completedStepCount} of {wizardSteps.length} steps complete</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">{completionPercent}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${completionPercent}%` }} />
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
                {wizardSteps.map((item) => (
                    <button 
                        key={item.id} 
                        type="button" 
                        onClick={() => {
                            setSubmitError("");
                            setStep(item.id);
                        }} 
                        className={`rounded-[18px] border px-4 py-3 text-left transition-all duration-300 ${
                            step === item.id
                            ? "border-indigo-300 bg-indigo-50 shadow-sm"
                            : "border-slate-200/60 bg-white hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">Step {item.id}</p>
                                <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                            </div>
                            <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                                getStepMessages(item.id).length === 0
                                ? "bg-indigo-100 text-indigo-700"
                                : step === item.id
                                    ? "bg-indigo-500 text-white"
                                    : "bg-slate-100 text-slate-400"
                            }`}>
                                {getStepMessages(item.id).length === 0 ? "✓" : item.id}
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                    </button>
                ))}
            </div>

            {currentStepMessages.length > 0 && (
                <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                    <p className="font-semibold">Please fix the current step:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        {currentStepMessages.map((message) => (
                            <li key={message}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                    <div className="space-y-6">
                        {step === 1 && (
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="md:col-span-2">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Property title</span>
                                    <input 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.title ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        placeholder="Property title" 
                                        value={form.title} 
                                        onChange={(e) => setForm({ ...form, title: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.title)} 
                                    />
                                    {stepFieldErrors.title && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.title}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Property type</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.type ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.type} 
                                        onChange={(e) => setForm({ ...form, type: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.type)}
                                    >
                                        {["PG", "ROOM", "FLAT", "HOSTEL"].map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.type && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.type}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.category ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.category || ""} 
                                        onChange={(e) => setForm({ ...form, category: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.category)}
                                    >
                                        {categoryOptions.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.category && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.category}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Listed by</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.listedByType ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.listedByType || "OWNER"} 
                                        onChange={(e) => setForm({ ...form, listedByType: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.listedByType)}
                                    >
                                        {["OWNER", "BROKER", "MANAGER"].map((listedBy) => (
                                            <option key={listedBy} value={listedBy}>{listedBy}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.listedByType && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.listedByType}</p>}
                                </label>
                                <label className="md:col-span-2">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
                                    <textarea 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition min-h-[160px] resize-y focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.description ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        placeholder="Describe the property, neighborhood, amenities, and who it is best suited for." 
                                        value={form.description} 
                                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.description)} 
                                    />
                                    <div className="mt-1 flex items-center justify-between gap-3">
                                        {stepFieldErrors.description ? (
                                            <p className="text-xs font-semibold text-rose-500">{stepFieldErrors.description}</p>
                                        ) : (
                                            <span className="text-xs text-slate-400">Minimum 20 characters</span>
                                        )}
                                        <span className="text-xs text-slate-400">{form.description.trim().length} chars</span>
                                    </div>
                                </label>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="md:col-span-2">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
                                    <input 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.location ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        placeholder="Location" 
                                        value={form.location} 
                                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.location)} 
                                    />
                                    {stepFieldErrors.location && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.location}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Area / Locality</span>
                                    <input 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        placeholder="Area / Locality" 
                                        value={form.areaLocality || ""} 
                                        onChange={(e) => setForm({ ...form, areaLocality: e.target.value })} 
                                    />
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Contact number</span>
                                    <input 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        placeholder="Contact number" 
                                        value={form.contactNumber || ""} 
                                        onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} 
                                    />
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">District</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.district ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.district || ""} 
                                        onChange={(e) => setForm({ ...form, district: e.target.value, city: "" })} 
                                        aria-invalid={Boolean(stepFieldErrors.district)}
                                    >
                                        <option value="">Select district</option>
                                        {maharashtraDistricts.map((district) => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.district && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.district}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">City / town</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.city ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.city || ""} 
                                        onChange={(e) => setForm({ ...form, city: e.target.value })} 
                                        disabled={!form.district} 
                                        aria-invalid={Boolean(stepFieldErrors.city)}
                                    >
                                        <option value="">{form.district ? "Select city / town" : "Select district first"}</option>
                                        {cityOptions.map((city) => (
                                            <option key={city.slug} value={city.name}>{city.name}</option>
                                        ))}
                                        {form.city && !cityOptions.some((city) => city.name === form.city) && (
                                            <option value={form.city}>{form.city}</option>
                                        )}
                                    </select>
                                    {stepFieldErrors.city && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.city}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">State</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.state ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.state || "Maharashtra"} 
                                        onChange={(e) => setForm({ ...form, state: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.state)}
                                    >
                                        <option value="Maharashtra">Maharashtra</option>
                                    </select>
                                    {stepFieldErrors.state && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.state}</p>}
                                </label>
                                <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                                    <label>
                                        <span className="mb-2 block text-sm font-semibold text-slate-700">Latitude</span>
                                        <input 
                                            className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                            type="number" 
                                            step="0.000001" 
                                            placeholder="Latitude" 
                                            value={form.latitude ?? ""} 
                                            onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })} 
                                        />
                                    </label>
                                    <label>
                                        <span className="mb-2 block text-sm font-semibold text-slate-700">Longitude</span>
                                        <input 
                                            className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                            type="number" 
                                            step="0.000001" 
                                            placeholder="Longitude" 
                                            value={form.longitude ?? ""} 
                                            onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })} 
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-5 md:grid-cols-2">
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Monthly rent</span>
                                    <input 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.price ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        type="number" 
                                        placeholder="Monthly rent" 
                                        value={form.price} 
                                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
                                        aria-invalid={Boolean(stepFieldErrors.price)} 
                                    />
                                    {stepFieldErrors.price && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.price}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Security deposit</span>
                                    <input 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        type="number" 
                                        placeholder="Security deposit" 
                                        value={form.securityDeposit ?? 0} 
                                        onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })} 
                                    />
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Sharing type</span>
                                    <select 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        value={form.sharingType || ""} 
                                        onChange={(e) => setForm({ ...form, sharingType: e.target.value })}
                                    >
                                        <option value="">Select sharing type</option>
                                        {sharingOptions.map((sharing) => (
                                            <option key={sharing} value={sharing}>{sharing}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Furnished status</span>
                                    <select 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        value={form.furnishedStatus || "SEMI_FURNISHED"} 
                                        onChange={(e) => setForm({ ...form, furnishedStatus: e.target.value })}
                                    >
                                        {["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"].map((status) => (
                                            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Availability</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.availabilityStatus ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.availabilityStatus || "AVAILABLE"} 
                                        onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.availabilityStatus)}
                                    >
                                        {["AVAILABLE", "OCCUPIED", "UPCOMING"].map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.availabilityStatus && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.availabilityStatus}</p>}
                                </label>
                                <label>
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Available from date</span>
                                    <input 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.availableFromDate ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        placeholder="Available from date" 
                                        value={form.availableFromDate || ""} 
                                        onChange={(e) => setForm({ ...form, availableFromDate: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.availableFromDate)} 
                                    />
                                    {stepFieldErrors.availableFromDate && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.availableFromDate}</p>}
                                </label>
                                <label className="md:col-span-2">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Gender preference</span>
                                    <select 
                                        className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.gender ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                        value={form.gender} 
                                        onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                                        aria-invalid={Boolean(stepFieldErrors.gender)}
                                    >
                                        {["ANY", "BOYS", "GIRLS"].map((gender) => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                    {stepFieldErrors.gender && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.gender}</p>}
                                </label>
                                <label className="md:col-span-2">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Occupancy details</span>
                                    <textarea 
                                        className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition min-h-[120px] resize-y focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                        placeholder="Occupancy details" 
                                        value={form.occupancyDetails || ""} 
                                        onChange={(e) => setForm({ ...form, occupancyDetails: e.target.value })} 
                                    />
                                </label>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Sparkles className="size-4 shrink-0 text-indigo-500" /> Amenities
                                        </p>
                                        {stepFieldErrors.amenities && <p className="text-xs font-semibold text-rose-500">{stepFieldErrors.amenities}</p>}
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {amenityOptions.map((amenity) => {
                                            const checked = form.amenities.includes(amenity);
                                            return (
                                                <label key={amenity} className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition ${checked ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm" : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm text-slate-700"}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="checkbox checkbox-primary checkbox-sm shrink-0 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                                                        checked={checked} 
                                                        onChange={() => setForm({
                                                            ...form,
                                                            amenities: checked
                                                                ? form.amenities.filter((item) => item !== amenity)
                                                                : [...form.amenities, amenity]
                                                        })} 
                                                    />
                                                    <span className="text-sm font-medium">{amenity}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2 mt-8">
                                    <label>
                                        <span className="mb-2 block text-sm font-semibold text-slate-700">Listing source</span>
                                        <input 
                                            className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                            placeholder="Listing source" 
                                            value={form.listingSource || ""} 
                                            onChange={(e) => setForm({ ...form, listingSource: e.target.value })} 
                                        />
                                    </label>
                                    <label>
                                        <span className="mb-2 block text-sm font-semibold text-slate-700">Listing URL</span>
                                        <input 
                                            className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                                            placeholder="Listing URL" 
                                            value={form.listingUrl || ""} 
                                            onChange={(e) => setForm({ ...form, listingUrl: e.target.value })} 
                                        />
                                    </label>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <ImagePlus className="size-4 shrink-0 text-indigo-500" /> Upload Property Images
                                        </span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            disabled={uploading} 
                                            onChange={handleFileUpload} 
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-[12px] file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50" 
                                        />
                                        {uploading && <p className="mt-2 text-xs font-semibold text-indigo-600 animate-pulse">Uploading images...</p>}
                                        {uploadError && <p className="mt-2 text-xs font-semibold text-rose-500">{uploadError}</p>}
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <ImagePlus className="size-4 shrink-0 text-indigo-500" /> Image URLs (one per line)
                                        </span>
                                        <textarea 
                                            className={`w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition min-h-[96px] focus:ring-4 focus:ring-indigo-500/10 ${stepFieldErrors.imageUrls ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white focus:border-indigo-500"}`} 
                                            placeholder="URLs will automatically populate here after upload. You can also paste manually." 
                                            value={imagesText} 
                                            onChange={(e) => setImagesText(e.target.value)} 
                                            aria-invalid={Boolean(stepFieldErrors.imageUrls)} 
                                        />
                                        {stepFieldErrors.imageUrls && <p className="mt-1 text-xs font-semibold text-rose-500">{stepFieldErrors.imageUrls}</p>}
                                    </label>
                                    {imagesText.split("\n").map((item) => item.trim()).filter(Boolean).length > 0 && (
                                        <div className="space-y-2 pt-2">
                                            <p className="text-xs font-semibold text-slate-500">Uploaded Image Previews / Thumbnails:</p>
                                            <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                                                {imagesText.split("\n").map((item) => item.trim()).filter(Boolean).map((url, index) => (
                                                    <div key={url + index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                                                        <img src={url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
                                                        <button 
                                                            type="button" 
                                                            onClick={() => {
                                                                const urls = imagesText.split("\n").map((item) => item.trim()).filter(Boolean);
                                                                const nextUrls = urls.filter((_, idx) => idx !== index);
                                                                setImagesText(nextUrls.join("\n"));
                                                            }} 
                                                            className="absolute top-1 right-1 flex size-6 items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md transition opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X className="size-3 shrink-0" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between border-t border-slate-100 pt-6">
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" 
                                onClick={() => {
                                    setSubmitError("");
                                    setStepErrors((current) => ({ ...current, [step]: [] }));
                                    setStep((current) => (current > 1 ? (current - 1) : current));
                                }} 
                                disabled={step === 1 || loading}
                            >
                                Back
                            </button>
                            <button 
                                type="button" 
                                className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                onClick={() => persistDraft(true)} 
                                disabled={loading}
                            >
                                Save draft
                            </button>
                            {step < 4 && (
                                <button type="submit" className="flex items-center gap-1.5 rounded-[14px] bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600" disabled={loading}>
                                    Continue
                                </button>
                            )}
                        </div>
                        {step === 4 && (
                            <button type="submit" className="flex items-center gap-2 rounded-[14px] bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                <Save className="size-4 shrink-0" /> 
                                {loading ? "Saving..." : propertyId ? "Update Property" : "Publish Property"}
                            </button>
                        )}
                    </div>

                    {submitError && <p className="text-sm font-semibold text-rose-500 bg-rose-50 p-3 rounded-[12px]">{submitError}</p>}
                    {draftNotice && <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 p-3 rounded-[12px]">{draftNotice}</p>}

                    <div className="md:hidden">
                        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-18px_44px_-28px_rgba(15,23,42,0.15)] backdrop-blur">
                            <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2">
                                <button 
                                    type="button" 
                                    className="rounded-[12px] border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50" 
                                    onClick={() => {
                                        setSubmitError("");
                                        setStepErrors((current) => ({ ...current, [step]: [] }));
                                        setStep((current) => (current > 1 ? (current - 1) : current));
                                    }} 
                                    disabled={step === 1 || loading}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    className="rounded-[12px] border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50" 
                                    onClick={() => persistDraft(true)} 
                                    disabled={loading}
                                >
                                    Save draft
                                </button>
                                {step < 4 ? (
                                    <button type="submit" className="rounded-[12px] bg-slate-900 px-3 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600" disabled={loading}>
                                        Continue
                                    </button>
                                ) : (
                                    <button type="submit" className="flex items-center justify-center gap-1.5 rounded-[12px] bg-indigo-600 px-3 py-3 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700" disabled={loading}>
                                        <Save className="size-3.5 shrink-0" /> 
                                        {loading ? "Saving..." : propertyId ? "Update" : "Publish"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="sticky top-24 h-fit space-y-4 p-5 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Live preview</p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900 font-heading">How the listing will look</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                            This preview updates while you fill the form so owners can catch issues early.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
                        <div className="relative aspect-[4/3] bg-slate-100">
                            {previewImage ? (
                                <Image src={previewImage} alt={form.title || "Property preview"} fill className="object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                                    Add image URLs to preview
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 p-5">
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 shrink-0">
                                    {form.type || "TYPE"}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 shrink-0">
                                    {form.category || "Category"}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 truncate" title={form.title || "Property title"}>{form.title || "Property title"}</h4>
                                <p className="mt-1 text-xs font-medium text-slate-500 truncate" title={[form.areaLocality, form.city, form.district, form.state].filter(Boolean).join(", ") || "Location preview"}>
                                    {[form.areaLocality, form.city, form.district, form.state].filter(Boolean).join(", ") || "Location preview"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-3 border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Rent</p>
                                    <p className="text-xl font-extrabold text-indigo-600">Rs. {form.price || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Deposit</p>
                                    <p className="text-sm font-bold text-slate-700">{form.securityDeposit ? `Rs. ${form.securityDeposit}` : "On request"}</p>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <ShieldCheck className="size-3.5 shrink-0 text-indigo-500" /> Availability
                                    </div>
                                    <p className="mt-1 font-semibold text-slate-700">{form.availabilityStatus || "AVAILABLE"}</p>
                                </div>
                                <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <BedDouble className="size-3.5 shrink-0 text-indigo-500" /> Furnishing
                                    </div>
                                    <p className="mt-1 font-semibold text-slate-700">{form.furnishedStatus ? form.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
                                </div>
                                <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Wallet className="size-3.5 shrink-0 text-indigo-500" /> Sharing
                                    </div>
                                    <p className="mt-1 font-semibold text-slate-700">{form.sharingType || "Not specified"}</p>
                                </div>
                                <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <MapPin className="size-3.5 shrink-0 text-indigo-500" /> Listed by
                                    </div>
                                    <p className="mt-1 font-semibold text-slate-700">{form.listedByType || "OWNER"}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                {form.amenities.slice(0, 4).map((amenity) => (
                                    <span key={amenity} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 shrink-0">
                                        {amenity}
                                    </span>
                                ))}
                                {form.amenities.length === 0 && (
                                    <span className="rounded-full border border-dashed border-slate-300 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-400 shrink-0">
                                        No amenities selected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}
