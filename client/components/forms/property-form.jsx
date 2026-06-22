"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BedDouble, ImagePlus, MapPin, Save, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { createProperty, updateProperty } from "@/services/property-service";
import { firstZodError, propertySchema } from "@/lib/validation";
import { majorCitiesByDistrict, maharashtraDistricts } from "@/lib/maharashtra-data";
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
    const [stepErrors, setStepErrors] = useState({
        1: [],
        2: [],
        3: [],
        4: []
    });
    const [submitError, setSubmitError] = useState("");
    const [draftNotice, setDraftNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const cityOptions = form.district ? (majorCitiesByDistrict[form.district] || []) : [];
    const storageKey = propertyId ? `roomrent-property-draft:${propertyId}` : "roomrent-property-draft:new";
    const getStepFieldErrors = (targetStep) => {
        const errors = {};
        if (targetStep === 1) {
            if (!form.title.trim())
                errors.title = "Property title is required.";
            if (!form.description.trim()) {
                errors.description = "Description is required.";
            }
            else if (form.description.trim().length < 20) {
                errors.description = "Description should be at least 20 characters.";
            }
            if (!form.type)
                errors.type = "Choose a property type.";
            if (!form.category)
                errors.category = "Choose a category.";
            if (!form.listedByType)
                errors.listedByType = "Choose who is listing this property.";
        }
        if (targetStep === 2) {
            if (!form.location.trim())
                errors.location = "Location is required.";
            if (!String(form.district || "").trim())
                errors.district = "District is required.";
            if (!String(form.city || "").trim())
                errors.city = "City is required.";
            if (!String(form.state || "").trim())
                errors.state = "State is required.";
        }
        if (targetStep === 3) {
            if (!(form.price > 0))
                errors.price = "Monthly rent must be greater than 0.";
            if (!form.availabilityStatus)
                errors.availabilityStatus = "Availability status is required.";
            if (!form.gender)
                errors.gender = "Choose a gender preference.";
            if (!String(form.availableFromDate || "").trim())
                errors.availableFromDate = "Available from date is required.";
        }
        if (targetStep === 4) {
            if (form.amenities.length === 0)
                errors.amenities = "Select at least one amenity.";
            if (imagesText.split("\n").map((item) => item.trim()).filter(Boolean).length === 0)
                errors.imageUrls = "Add at least one image URL.";
        }
        return errors;
    };
    const getStepMessages = (targetStep) => Object.values(getStepFieldErrors(targetStep)).filter((message) => Boolean(message));
    const stepFieldErrors = getStepFieldErrors(step);
    const completedStepCount = wizardSteps.filter((item) => getStepMessages(item.id).length === 0).length;
    const completionPercent = Math.round((completedStepCount / wizardSteps.length) * 100);
    const persistDraft = (showFeedback = false) => {
        if (typeof window === "undefined") {
            return;
        }
        const snapshot = { form, imagesText, step };
        window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
        if (showFeedback) {
            setDraftNotice("Draft saved locally.");
        }
    };
    useEffect(() => {
        if (initialValues || typeof window === "undefined") {
            return;
        }
        const savedDraft = window.localStorage.getItem(storageKey);
        if (!savedDraft) {
            return;
        }
        try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.form) {
                setForm((current) => ({ ...current, ...parsed.form }));
            }
            if (typeof parsed.imagesText === "string") {
                setImagesText(parsed.imagesText);
            }
            if (parsed.step) {
                setStep(parsed.step);
            }
        }
        catch {
            window.localStorage.removeItem(storageKey);
        }
    }, [initialValues, storageKey]);
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const timeout = window.setTimeout(() => {
            persistDraft(false);
        }, 300);
        return () => window.clearTimeout(timeout);
    }, [form, imagesText, step, storageKey]);
    useEffect(() => {
        if (!draftNotice || typeof window === "undefined") {
            return;
        }
        const timeout = window.setTimeout(() => setDraftNotice(""), 2200);
        return () => window.clearTimeout(timeout);
    }, [draftNotice]);
    useEffect(() => {
        if (stepErrors[step].length === 0) {
            return;
        }
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
    const previewImage = imagesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)[0];
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
            }
            else {
                await createProperty(payload);
            }
            clearDraft();
            router.push("/dashboard/owner/my-listings");
        }
        catch (err) {
            setSubmitError(err?.response?.data?.message || "Unable to save property. Check required fields, subscription plan and permissions.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "panel space-y-6 p-6", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-base-300/70 pb-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rf-cyan)]", children: "Listing details" }), _jsx("h2", { className: "mt-2 text-2xl font-bold text-neutral", children: propertyId ? "Update property" : "Publish a property" })] }), _jsx("div", { className: "icon-tile", children: _jsx(Sparkles, { className: "size-5" }) })] }), _jsxs("div", { className: "rounded-[24px] border border-base-300 bg-white/80 p-4 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)]", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]", children: "Progress" }), _jsxs("p", { className: "mt-1 text-sm font-semibold text-[var(--rf-ink)]", children: [completedStepCount, " of ", wizardSteps.length, " steps complete"] })] }), _jsxs("p", { className: "text-sm font-bold text-[var(--rf-cyan)]", children: [completionPercent, "%"] })] }), _jsx("div", { className: "mt-3 h-2 overflow-hidden rounded-full bg-base-200", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[var(--rf-cyan)] via-[var(--rf-accent)] to-[var(--rf-cyan)] transition-all duration-500 ease-out", style: { width: `${completionPercent}%` } }) })] }), _jsx("div", { className: "grid gap-3 md:grid-cols-4", children: wizardSteps.map((item) => (_jsxs("button", { type: "button", onClick: () => {
                        setSubmitError("");
                        setStep(item.id);
                    }, className: `rounded-[18px] border px-4 py-3 text-left transition-all duration-300 ${step === item.id
                        ? "border-[rgba(15,118,110,0.28)] bg-[rgba(15,118,110,0.08)] shadow-[0_16px_40px_-32px_rgba(239,61,129,0.8)]"
                        : "border-base-300 bg-white"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-xs font-bold uppercase tracking-[0.16em] text-[var(--rf-cyan)]", children: ["Step ", item.id] }), _jsx("p", { className: "mt-1 font-semibold text-[var(--rf-ink)]", children: item.title })] }), _jsx("div", { className: `mt-0.5 flex size-7 items-center justify-center rounded-full text-xs font-extrabold ${getStepMessages(item.id).length === 0
                                        ? "bg-emerald-50 text-emerald-600"
                                        : step === item.id
                                            ? "bg-[var(--rf-cyan)] text-white"
                                            : "bg-base-200 text-base-content/50"}`, children: getStepMessages(item.id).length === 0 ? "?" : item.id })] }), _jsx("p", { className: "mt-1 text-xs text-[var(--rf-muted)]", children: item.hint })] }, item.id))) }), currentStepMessages.length > 0 ? (_jsxs("div", { className: "rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: [_jsx("p", { className: "font-semibold", children: "Please fix the current step:" }), _jsx("ul", { className: "mt-2 list-disc space-y-1 pl-5", children: currentStepMessages.map((message) => (_jsx("li", { children: message }, message))) })] })) : null, _jsxs("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "wizard-step-panel space-y-6", children: [step === 1 ? (_jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("label", { className: "md:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Property title" }), _jsx("input", { className: `form-input ${stepFieldErrors.title ? "border-error/40" : ""}`, placeholder: "Property title", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.title) }), stepFieldErrors.title ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.title }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Property type" }), _jsx("select", { className: `form-select ${stepFieldErrors.type ? "border-error/40" : ""}`, value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.type), children: ["PG", "ROOM", "FLAT", "HOSTEL"].map((type) => _jsx("option", { value: type, children: type }, type)) }), stepFieldErrors.type ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.type }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Category" }), _jsx("select", { className: `form-select ${stepFieldErrors.category ? "border-error/40" : ""}`, value: form.category || "", onChange: (e) => setForm({ ...form, category: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.category), children: categoryOptions.map((category) => _jsx("option", { value: category, children: category }, category)) }), stepFieldErrors.category ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.category }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Listed by" }), _jsx("select", { className: `form-select ${stepFieldErrors.listedByType ? "border-error/40" : ""}`, value: form.listedByType || "OWNER", onChange: (e) => setForm({ ...form, listedByType: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.listedByType), children: ["OWNER", "BROKER", "MANAGER"].map((listedBy) => _jsx("option", { value: listedBy, children: listedBy }, listedBy)) }), stepFieldErrors.listedByType ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.listedByType }) : null] }), _jsxs("label", { className: "md:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Description" }), _jsx("textarea", { className: `form-textarea min-h-40 ${stepFieldErrors.description ? "border-error/40" : ""}`, placeholder: "Describe the property, neighborhood, amenities, and who it is best suited for.", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.description) }), _jsxs("div", { className: "mt-1 flex items-center justify-between gap-3", children: [stepFieldErrors.description ? _jsx("p", { className: "text-xs font-semibold text-error", children: stepFieldErrors.description }) : _jsx("span", { className: "text-xs text-base-content/45", children: "Minimum 20 characters" }), _jsxs("span", { className: "text-xs text-base-content/45", children: [form.description.trim().length, " chars"] })] })] })] })) : null, step === 2 ? (_jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("label", { className: "md:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Location" }), _jsx("input", { className: `form-input ${stepFieldErrors.location ? "border-error/40" : ""}`, placeholder: "Location", value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.location) }), stepFieldErrors.location ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.location }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Area / Locality" }), _jsx("input", { className: "form-input", placeholder: "Area / Locality", value: form.areaLocality || "", onChange: (e) => setForm({ ...form, areaLocality: e.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Contact number" }), _jsx("input", { className: "form-input", placeholder: "Contact number", value: form.contactNumber || "", onChange: (e) => setForm({ ...form, contactNumber: e.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "District" }), _jsxs("select", { className: `form-select ${stepFieldErrors.district ? "border-error/40" : ""}`, value: form.district || "", onChange: (e) => setForm({ ...form, district: e.target.value, city: "" }), "aria-invalid": Boolean(stepFieldErrors.district), children: [_jsx("option", { value: "", children: "Select district" }), maharashtraDistricts.map((district) => _jsx("option", { value: district, children: district }, district))] }), stepFieldErrors.district ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.district }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "City / town" }), _jsxs("select", { className: `form-select ${stepFieldErrors.city ? "border-error/40" : ""}`, value: form.city || "", onChange: (e) => setForm({ ...form, city: e.target.value }), disabled: !form.district, "aria-invalid": Boolean(stepFieldErrors.city), children: [_jsx("option", { value: "", children: form.district ? "Select city / town" : "Select district first" }), cityOptions.map((city) => _jsx("option", { value: city.name, children: city.name }, city.slug)), form.city && !cityOptions.some((city) => city.name === form.city) ? _jsx("option", { value: form.city, children: form.city }) : null] }), stepFieldErrors.city ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.city }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "State" }), _jsx("select", { className: `form-select ${stepFieldErrors.state ? "border-error/40" : ""}`, value: form.state || "Maharashtra", onChange: (e) => setForm({ ...form, state: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.state), children: _jsx("option", { value: "Maharashtra", children: "Maharashtra" }) }), stepFieldErrors.state ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.state }) : null] }), _jsxs("div", { className: "grid gap-4 md:col-span-2 md:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Latitude" }), _jsx("input", { className: "form-input", type: "number", step: "0.000001", placeholder: "Latitude", value: form.latitude ?? "", onChange: (e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Longitude" }), _jsx("input", { className: "form-input", type: "number", step: "0.000001", placeholder: "Longitude", value: form.longitude ?? "", onChange: (e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null }) })] })] })] })) : null, step === 3 ? (_jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Monthly rent" }), _jsx("input", { className: `form-input ${stepFieldErrors.price ? "border-error/40" : ""}`, type: "number", placeholder: "Monthly rent", value: form.price, onChange: (e) => setForm({ ...form, price: Number(e.target.value) }), "aria-invalid": Boolean(stepFieldErrors.price) }), stepFieldErrors.price ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.price }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Security deposit" }), _jsx("input", { className: "form-input", type: "number", placeholder: "Security deposit", value: form.securityDeposit ?? 0, onChange: (e) => setForm({ ...form, securityDeposit: Number(e.target.value) }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Sharing type" }), _jsxs("select", { className: "form-select", value: form.sharingType || "", onChange: (e) => setForm({ ...form, sharingType: e.target.value }), children: [_jsx("option", { value: "", children: "Select sharing type" }), sharingOptions.map((sharing) => _jsx("option", { value: sharing, children: sharing }, sharing))] })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Furnished status" }), _jsx("select", { className: "form-select", value: form.furnishedStatus || "SEMI_FURNISHED", onChange: (e) => setForm({ ...form, furnishedStatus: e.target.value }), children: ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"].map((status) => _jsx("option", { value: status, children: status.replaceAll("_", " ") }, status)) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Availability" }), _jsx("select", { className: `form-select ${stepFieldErrors.availabilityStatus ? "border-error/40" : ""}`, value: form.availabilityStatus || "AVAILABLE", onChange: (e) => setForm({ ...form, availabilityStatus: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.availabilityStatus), children: ["AVAILABLE", "OCCUPIED", "UPCOMING"].map((status) => _jsx("option", { value: status, children: status }, status)) }), stepFieldErrors.availabilityStatus ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.availabilityStatus }) : null] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Available from date" }), _jsx("input", { className: `form-input ${stepFieldErrors.availableFromDate ? "border-error/40" : ""}`, placeholder: "Available from date", value: form.availableFromDate || "", onChange: (e) => setForm({ ...form, availableFromDate: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.availableFromDate) }), stepFieldErrors.availableFromDate ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.availableFromDate }) : null] }), _jsxs("label", { className: "md:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Gender preference" }), _jsx("select", { className: `form-select ${stepFieldErrors.gender ? "border-error/40" : ""}`, value: form.gender, onChange: (e) => setForm({ ...form, gender: e.target.value }), "aria-invalid": Boolean(stepFieldErrors.gender), children: ["ANY", "BOYS", "GIRLS"].map((gender) => _jsx("option", { value: gender, children: gender }, gender)) }), stepFieldErrors.gender ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.gender }) : null] }), _jsxs("label", { className: "md:col-span-2", children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Occupancy details" }), _jsx("textarea", { className: "form-textarea min-h-32", placeholder: "Occupancy details", value: form.occupancyDetails || "", onChange: (e) => setForm({ ...form, occupancyDetails: e.target.value }) })] })] })) : null, step === 4 ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "form-section space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("p", { className: "flex items-center gap-2 text-sm font-semibold text-base-content/80", children: [_jsx(Sparkles, { className: "size-4 text-[var(--rf-cyan)]" }), " Amenities"] }), stepFieldErrors.amenities ? _jsx("p", { className: "text-xs font-semibold text-error", children: stepFieldErrors.amenities }) : null] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: amenityOptions.map((amenity) => {
                                                            const checked = form.amenities.includes(amenity);
                                                            return (_jsxs("label", { className: `flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition ${checked ? "border-[rgba(15,118,110,0.24)] bg-[rgba(15,118,110,0.08)] text-neutral" : "border-base-300 bg-white hover:border-[rgba(15,118,110,0.28)]"}`, children: [_jsx("input", { type: "checkbox", className: "checkbox checkbox-primary checkbox-sm", checked: checked, onChange: () => setForm({
                                                                            ...form,
                                                                            amenities: checked
                                                                                ? form.amenities.filter((item) => item !== amenity)
                                                                                : [...form.amenities, amenity]
                                                                        }) }), _jsx("span", { className: "text-sm", children: amenity })] }, amenity));
                                                        }) })] }), _jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Listing source" }), _jsx("input", { className: "form-input", placeholder: "Listing source", value: form.listingSource || "", onChange: (e) => setForm({ ...form, listingSource: e.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { className: "mb-2 block text-sm font-semibold text-base-content/80", children: "Listing URL" }), _jsx("input", { className: "form-input", placeholder: "Listing URL", value: form.listingUrl || "", onChange: (e) => setForm({ ...form, listingUrl: e.target.value }) })] })] }), _jsxs("label", { className: "block", children: [_jsxs("span", { className: "mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/80", children: [_jsx(ImagePlus, { className: "size-4 text-[var(--rf-cyan)]" }), " Image URLs"] }), _jsx("textarea", { className: `form-textarea min-h-32 ${stepFieldErrors.imageUrls ? "border-error/40" : ""}`, placeholder: "One image URL per line", value: imagesText, onChange: (e) => setImagesText(e.target.value), "aria-invalid": Boolean(stepFieldErrors.imageUrls) }), stepFieldErrors.imageUrls ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: stepFieldErrors.imageUrls }) : null] })] })) : null] }, step), _jsxs("div", { className: "hidden flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", className: "rounded-2xl border border-base-300 bg-white px-5 py-3 text-sm font-bold text-[var(--rf-ink)] disabled:cursor-not-allowed disabled:opacity-50", onClick: () => {
                                                    setSubmitError("");
                                                    setStepErrors((current) => ({ ...current, [step]: [] }));
                                                    setStep((current) => (current > 1 ? (current - 1) : current));
                                                }, disabled: step === 1 || loading, children: "Back" }), _jsx("button", { type: "button", className: "rounded-2xl border border-base-300 bg-white px-5 py-3 text-sm font-bold text-[var(--rf-ink)] transition hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)] disabled:cursor-not-allowed disabled:opacity-50", onClick: () => persistDraft(true), disabled: loading, children: "Save draft" }), step < 4 ? (_jsx("button", { type: "submit", className: "glow-button", disabled: loading, children: "Continue" })) : null] }), step === 4 ? (_jsxs("button", { type: "submit", className: "glow-button", disabled: loading, children: [_jsx(Save, { className: "relative size-4" }), loading ? "Saving..." : propertyId ? "Update Property" : "Publish Property"] })) : null] }), submitError ? _jsx("p", { className: "text-sm text-error", children: submitError }) : null, draftNotice ? _jsx("p", { className: "text-sm font-semibold text-emerald-600", children: draftNotice }) : null, _jsx("div", { className: "md:hidden", children: _jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-white/95 px-4 py-3 shadow-[0_-18px_44px_-28px_rgba(15,23,42,0.45)] backdrop-blur", children: _jsxs("div", { className: "mx-auto grid max-w-5xl grid-cols-3 gap-2", children: [_jsx("button", { type: "button", className: "rounded-2xl border border-base-300 bg-white px-3 py-3 text-xs font-bold text-[var(--rf-ink)] disabled:cursor-not-allowed disabled:opacity-50", onClick: () => {
                                                    setSubmitError("");
                                                    setStepErrors((current) => ({ ...current, [step]: [] }));
                                                    setStep((current) => (current > 1 ? (current - 1) : current));
                                                }, disabled: step === 1 || loading, children: "Back" }), _jsx("button", { type: "button", className: "rounded-2xl border border-base-300 bg-white px-3 py-3 text-xs font-bold text-[var(--rf-ink)] transition hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)] disabled:cursor-not-allowed disabled:opacity-50", onClick: () => persistDraft(true), disabled: loading, children: "Save draft" }), step < 4 ? (_jsx("button", { type: "submit", className: "glow-button min-h-12 px-3 text-xs", disabled: loading, children: "Continue" })) : (_jsxs("button", { type: "submit", className: "glow-button min-h-12 px-3 text-xs", disabled: loading, children: [_jsx(Save, { className: "relative size-4" }), loading ? "Saving..." : propertyId ? "Update" : "Publish"] }))] }) }) })] }), _jsxs("aside", { className: "panel sticky top-24 h-fit space-y-4 p-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]", children: "Live preview" }), _jsx("h3", { className: "mt-2 text-2xl font-bold text-[var(--rf-ink)]", children: "How the listing will look" }), _jsx("p", { className: "mt-2 text-sm font-medium leading-6 text-[var(--rf-muted)]", children: "This preview updates while you fill the form so owners can catch issues early." })] }), _jsxs("div", { className: "overflow-hidden rounded-[24px] border border-base-300 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]", children: [_jsx("div", { className: "relative aspect-[4/3] bg-base-200", children: previewImage ? (_jsx(Image, { src: previewImage, alt: form.title || "Property preview", fill: true, className: "object-cover" })) : (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-base-content/40", children: "Add image URLs to preview" })) }), _jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("span", { className: "pill-badge border-green-100 bg-green-50 text-green-700", children: form.type || "TYPE" }), _jsx("span", { className: "pill-badge", children: form.category || "Category" })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-bold text-[var(--rf-ink)]", children: form.title || "Property title" }), _jsx("p", { className: "mt-2 text-sm font-medium leading-6 text-[var(--rf-muted)]", children: [form.areaLocality, form.city, form.district, form.state].filter(Boolean).join(", ") || "Location preview" })] }), _jsxs("div", { className: "flex items-center justify-between rounded-[18px] bg-base-100 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-base-content/50", children: "Rent" }), _jsxs("p", { className: "text-2xl font-extrabold text-[var(--rf-cyan)]", children: ["Rs. ", form.price || 0] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-base-content/50", children: "Deposit" }), _jsx("p", { className: "text-sm font-semibold text-[var(--rf-ink)]", children: form.securityDeposit ? `Rs. ${form.securityDeposit}` : "On request" })] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2 text-base-content/60", children: [_jsx(ShieldCheck, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Availability"] }), _jsx("p", { className: "mt-1 font-semibold text-base-content", children: form.availabilityStatus || "AVAILABLE" })] }), _jsxs("div", { className: "rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2 text-base-content/60", children: [_jsx(BedDouble, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Furnishing"] }), _jsx("p", { className: "mt-1 font-semibold text-base-content", children: form.furnishedStatus ? form.furnishedStatus.replaceAll("_", " ") : "Not specified" })] }), _jsxs("div", { className: "rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2 text-base-content/60", children: [_jsx(Wallet, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Sharing"] }), _jsx("p", { className: "mt-1 font-semibold text-base-content", children: form.sharingType || "Not specified" })] }), _jsxs("div", { className: "rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2 text-base-content/60", children: [_jsx(MapPin, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Listed by"] }), _jsx("p", { className: "mt-1 font-semibold text-base-content", children: form.listedByType || "OWNER" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [form.amenities.slice(0, 4).map((amenity) => (_jsx("span", { className: "rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/70", children: amenity }, amenity))), form.amenities.length === 0 ? (_jsx("span", { className: "rounded-full border border-dashed border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/45", children: "No amenities selected" })) : null] })] })] })] })] })] }));
}
