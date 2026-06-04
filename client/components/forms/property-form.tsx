"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BedDouble, ImagePlus, MapPin, Save, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { createProperty, updateProperty } from "@/services/property-service";
import { AvailabilityStatus, FurnishedStatus, GenderPreference, ListedByType, PropertyPayload, PropertyType } from "@/types";
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
] as const;

interface PropertyFormProps {
  initialValues?: PropertyPayload;
  propertyId?: string;
}

export function PropertyForm({ initialValues, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<PropertyPayload>(
    initialValues || {
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
    }
  );
  const [imagesText, setImagesText] = useState((initialValues?.imageUrls || []).join("\n"));
  const [stepErrors, setStepErrors] = useState<Record<1 | 2 | 3 | 4, string[]>>({
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
  type WizardStep = 1 | 2 | 3 | 4;

  const getStepFieldErrors = (targetStep: WizardStep) => {
    const errors: Partial<Record<string, string>> = {};

    if (targetStep === 1) {
      if (!form.title.trim()) errors.title = "Property title is required.";
      if (!form.description.trim()) {
        errors.description = "Description is required.";
      } else if (form.description.trim().length < 20) {
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

  const getStepMessages = (targetStep: WizardStep) => Object.values(getStepFieldErrors(targetStep)).filter((message): message is string => Boolean(message));

  const stepFieldErrors = getStepFieldErrors(step);
  const completedStepCount = (wizardSteps as readonly { id: WizardStep }[]).filter((item) => getStepMessages(item.id).length === 0).length;
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
      const parsed = JSON.parse(savedDraft) as {
        form?: Partial<PropertyPayload>;
        imagesText?: string;
        step?: 1 | 2 | 3 | 4;
      };
      if (parsed.form) {
        setForm((current) => ({ ...current, ...parsed.form }));
      }
      if (typeof parsed.imagesText === "string") {
        setImagesText(parsed.imagesText);
      }
      if (parsed.step) {
        setStep(parsed.step);
      }
    } catch {
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (step !== 4) {
      const messages = getStepMessages(step);
      if (messages.length > 0) {
        setSubmitError("");
        setStepErrors((current) => ({ ...current, [step]: messages }));
        return;
      }
      setStepErrors((current) => ({ ...current, [step]: [] }));
      setStep((current) => (current < 4 ? ((current + 1) as 1 | 2 | 3 | 4) : current));
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
      router.push("/dashboard/owner/my-listings");
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || "Unable to save property. Check required fields, subscription plan and permissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/70 pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef3d81]">Listing details</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral">{propertyId ? "Update property" : "Publish a property"}</h2>
        </div>
        <div className="icon-tile">
          <Sparkles className="size-5" />
        </div>
      </div>
      <div className="rounded-[24px] border border-base-300 bg-white/80 p-4 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ef3d81]">Progress</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">
              {completedStepCount} of {wizardSteps.length} steps complete
            </p>
          </div>
          <p className="text-sm font-bold text-[#ef3d81]">{completionPercent}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-base-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ef3d81] via-[#ff7a35] to-[#0f9f8f] transition-all duration-500 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
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
                ? "border-[#ef3d81]/25 bg-[#fff1f4] shadow-[0_16px_40px_-32px_rgba(239,61,129,0.8)]"
                : "border-base-300 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ef3d81]">Step {item.id}</p>
                <p className="mt-1 font-semibold text-[#111827]">{item.title}</p>
              </div>
              <div
                className={`mt-0.5 flex size-7 items-center justify-center rounded-full text-xs font-extrabold ${
                  getStepMessages(item.id as WizardStep).length === 0
                    ? "bg-emerald-50 text-emerald-600"
                    : step === item.id
                      ? "bg-[#ef3d81] text-white"
                      : "bg-base-200 text-base-content/50"
                }`}
              >
                {getStepMessages(item.id as WizardStep).length === 0 ? "✓" : item.id}
              </div>
            </div>
            <p className="mt-1 text-xs text-[#64748b]">{item.hint}</p>
          </button>
        ))}
      </div>
      {currentStepMessages.length > 0 ? (
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Please fix the current step:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {currentStepMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div key={step} className="wizard-step-panel space-y-6">
            {step === 1 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Property title</span>
                  <input
                    className={`form-input ${stepFieldErrors.title ? "border-error/40" : ""}`}
                    placeholder="Property title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.title)}
                  />
                  {stepFieldErrors.title ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.title}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Property type</span>
                  <select
                    className={`form-select ${stepFieldErrors.type ? "border-error/40" : ""}`}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                    aria-invalid={Boolean(stepFieldErrors.type)}
                  >
                    {["PG", "ROOM", "FLAT", "HOSTEL"].map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {stepFieldErrors.type ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.type}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Category</span>
                  <select
                    className={`form-select ${stepFieldErrors.category ? "border-error/40" : ""}`}
                    value={form.category || ""}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.category)}
                  >
                    {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  {stepFieldErrors.category ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.category}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Listed by</span>
                  <select
                    className={`form-select ${stepFieldErrors.listedByType ? "border-error/40" : ""}`}
                    value={form.listedByType || "OWNER"}
                    onChange={(e) => setForm({ ...form, listedByType: e.target.value as ListedByType })}
                    aria-invalid={Boolean(stepFieldErrors.listedByType)}
                  >
                    {["OWNER", "BROKER", "MANAGER"].map((listedBy) => <option key={listedBy} value={listedBy}>{listedBy}</option>)}
                  </select>
                  {stepFieldErrors.listedByType ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.listedByType}</p> : null}
                </label>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Description</span>
                  <textarea
                    className={`form-textarea min-h-40 ${stepFieldErrors.description ? "border-error/40" : ""}`}
                    placeholder="Describe the property, neighborhood, amenities, and who it is best suited for."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.description)}
                  />
                  <div className="mt-1 flex items-center justify-between gap-3">
                    {stepFieldErrors.description ? <p className="text-xs font-semibold text-error">{stepFieldErrors.description}</p> : <span className="text-xs text-base-content/45">Minimum 20 characters</span>}
                    <span className="text-xs text-base-content/45">{form.description.trim().length} chars</span>
                  </div>
                </label>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Location</span>
                  <input
                    className={`form-input ${stepFieldErrors.location ? "border-error/40" : ""}`}
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.location)}
                  />
                  {stepFieldErrors.location ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.location}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Area / Locality</span>
                  <input className="form-input" placeholder="Area / Locality" value={form.areaLocality || ""} onChange={(e) => setForm({ ...form, areaLocality: e.target.value })} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Contact number</span>
                  <input className="form-input" placeholder="Contact number" value={form.contactNumber || ""} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">District</span>
                  <select
                    className={`form-select ${stepFieldErrors.district ? "border-error/40" : ""}`}
                    value={form.district || ""}
                    onChange={(e) => setForm({ ...form, district: e.target.value, city: "" })}
                    aria-invalid={Boolean(stepFieldErrors.district)}
                  >
                    <option value="">Select district</option>
                    {maharashtraDistricts.map((district) => <option key={district} value={district}>{district}</option>)}
                  </select>
                  {stepFieldErrors.district ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.district}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">City / town</span>
                  <select
                    className={`form-select ${stepFieldErrors.city ? "border-error/40" : ""}`}
                    value={form.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    disabled={!form.district}
                    aria-invalid={Boolean(stepFieldErrors.city)}
                  >
                    <option value="">{form.district ? "Select city / town" : "Select district first"}</option>
                    {cityOptions.map((city) => <option key={city.slug} value={city.name}>{city.name}</option>)}
                    {form.city && !cityOptions.some((city) => city.name === form.city) ? <option value={form.city}>{form.city}</option> : null}
                  </select>
                  {stepFieldErrors.city ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.city}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">State</span>
                  <select
                    className={`form-select ${stepFieldErrors.state ? "border-error/40" : ""}`}
                    value={form.state || "Maharashtra"}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.state)}
                  >
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                  {stepFieldErrors.state ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.state}</p> : null}
                </label>
                <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-base-content/80">Latitude</span>
                    <input className="form-input" type="number" step="0.000001" placeholder="Latitude" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-base-content/80">Longitude</span>
                    <input className="form-input" type="number" step="0.000001" placeholder="Longitude" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })} />
                  </label>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Monthly rent</span>
                  <input
                    className={`form-input ${stepFieldErrors.price ? "border-error/40" : ""}`}
                    type="number"
                    placeholder="Monthly rent"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    aria-invalid={Boolean(stepFieldErrors.price)}
                  />
                  {stepFieldErrors.price ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.price}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Security deposit</span>
                  <input className="form-input" type="number" placeholder="Security deposit" value={form.securityDeposit ?? 0} onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })} />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Sharing type</span>
                  <select className="form-select" value={form.sharingType || ""} onChange={(e) => setForm({ ...form, sharingType: e.target.value })}>
                    <option value="">Select sharing type</option>
                    {sharingOptions.map((sharing) => <option key={sharing} value={sharing}>{sharing}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Furnished status</span>
                  <select className="form-select" value={form.furnishedStatus || "SEMI_FURNISHED"} onChange={(e) => setForm({ ...form, furnishedStatus: e.target.value as FurnishedStatus })}>
                    {["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Availability</span>
                  <select
                    className={`form-select ${stepFieldErrors.availabilityStatus ? "border-error/40" : ""}`}
                    value={form.availabilityStatus || "AVAILABLE"}
                    onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value as AvailabilityStatus })}
                    aria-invalid={Boolean(stepFieldErrors.availabilityStatus)}
                  >
                    {["AVAILABLE", "OCCUPIED", "UPCOMING"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  {stepFieldErrors.availabilityStatus ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.availabilityStatus}</p> : null}
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Available from date</span>
                  <input
                    className={`form-input ${stepFieldErrors.availableFromDate ? "border-error/40" : ""}`}
                    placeholder="Available from date"
                    value={form.availableFromDate || ""}
                    onChange={(e) => setForm({ ...form, availableFromDate: e.target.value })}
                    aria-invalid={Boolean(stepFieldErrors.availableFromDate)}
                  />
                  {stepFieldErrors.availableFromDate ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.availableFromDate}</p> : null}
                </label>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Gender preference</span>
                  <select
                    className={`form-select ${stepFieldErrors.gender ? "border-error/40" : ""}`}
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as GenderPreference })}
                    aria-invalid={Boolean(stepFieldErrors.gender)}
                  >
                    {["ANY", "BOYS", "GIRLS"].map((gender) => <option key={gender} value={gender}>{gender}</option>)}
                  </select>
                  {stepFieldErrors.gender ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.gender}</p> : null}
                </label>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-base-content/80">Occupancy details</span>
                  <textarea className="form-textarea min-h-32" placeholder="Occupancy details" value={form.occupancyDetails || ""} onChange={(e) => setForm({ ...form, occupancyDetails: e.target.value })} />
                </label>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-6">
                <div className="form-section space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-base-content/80"><Sparkles className="size-4 text-[#ef3d81]" /> Amenities</p>
                    {stepFieldErrors.amenities ? <p className="text-xs font-semibold text-error">{stepFieldErrors.amenities}</p> : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {amenityOptions.map((amenity) => {
                      const checked = form.amenities.includes(amenity);
                      return (
                        <label key={amenity} className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-3 transition ${checked ? "border-[#ff5c8a]/35 bg-[#fff1f4] text-neutral" : "border-base-300 bg-white hover:border-[#ff5c8a]/25"}`}>
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
                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-base-content/80">Listing source</span>
                    <input className="form-input" placeholder="Listing source" value={form.listingSource || ""} onChange={(e) => setForm({ ...form, listingSource: e.target.value })} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-base-content/80">Listing URL</span>
                    <input className="form-input" placeholder="Listing URL" value={form.listingUrl || ""} onChange={(e) => setForm({ ...form, listingUrl: e.target.value })} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/80"><ImagePlus className="size-4 text-[#ef3d81]" /> Image URLs</span>
                  <textarea
                    className={`form-textarea min-h-32 ${stepFieldErrors.imageUrls ? "border-error/40" : ""}`}
                    placeholder="One image URL per line"
                    value={imagesText}
                    onChange={(e) => setImagesText(e.target.value)}
                    aria-invalid={Boolean(stepFieldErrors.imageUrls)}
                  />
                  {stepFieldErrors.imageUrls ? <p className="mt-1 text-xs font-semibold text-error">{stepFieldErrors.imageUrls}</p> : null}
                </label>
              </div>
            ) : null}
          </div>

          <div className="hidden flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-2xl border border-base-300 bg-white px-5 py-3 text-sm font-bold text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  setSubmitError("");
                  setStepErrors((current) => ({ ...current, [step]: [] }));
                  setStep((current) => (current > 1 ? ((current - 1) as 1 | 2 | 3 | 4) : current));
                }}
                disabled={step === 1 || loading}
                >
                  Back
                </button>
              <button
                type="button"
                className="rounded-2xl border border-base-300 bg-white px-5 py-3 text-sm font-bold text-[#111827] transition hover:border-[#ef3d81]/25 hover:text-[#ef3d81] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => persistDraft(true)}
                disabled={loading}
              >
                Save draft
              </button>
              {step < 4 ? (
                <button type="submit" className="glow-button" disabled={loading}>
                  Continue
                </button>
              ) : null}
            </div>
            {step === 4 ? (
              <button type="submit" className="glow-button" disabled={loading}>
                <Save className="relative size-4" />
                {loading ? "Saving..." : propertyId ? "Update Property" : "Publish Property"}
              </button>
            ) : null}
          </div>
          {submitError ? <p className="text-sm text-error">{submitError}</p> : null}
          {draftNotice ? <p className="text-sm font-semibold text-emerald-600">{draftNotice}</p> : null}

          <div className="md:hidden">
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-white/95 px-4 py-3 shadow-[0_-18px_44px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2">
                <button
                  type="button"
                  className="rounded-2xl border border-base-300 bg-white px-3 py-3 text-xs font-bold text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    setSubmitError("");
                    setStepErrors((current) => ({ ...current, [step]: [] }));
                    setStep((current) => (current > 1 ? ((current - 1) as 1 | 2 | 3 | 4) : current));
                  }}
                  disabled={step === 1 || loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-base-300 bg-white px-3 py-3 text-xs font-bold text-[#111827] transition hover:border-[#ef3d81]/25 hover:text-[#ef3d81] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => persistDraft(true)}
                  disabled={loading}
                >
                  Save draft
                </button>
                {step < 4 ? (
                  <button type="submit" className="glow-button min-h-12 px-3 text-xs" disabled={loading}>
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="glow-button min-h-12 px-3 text-xs" disabled={loading}>
                    <Save className="relative size-4" />
                    {loading ? "Saving..." : propertyId ? "Update" : "Publish"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="panel sticky top-24 h-fit space-y-4 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ef3d81]">Live preview</p>
            <h3 className="mt-2 text-2xl font-bold text-[#111827]">How the listing will look</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">This preview updates while you fill the form so owners can catch issues early.</p>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-base-300 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
            <div className="relative aspect-[4/3] bg-base-200">
              {previewImage ? (
                <Image src={previewImage} alt={form.title || "Property preview"} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-base-content/40">Add image URLs to preview</div>
              )}
            </div>
            <div className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2">
                <span className="pill-badge border-green-100 bg-green-50 text-green-700">{form.type || "TYPE"}</span>
                <span className="pill-badge">{form.category || "Category"}</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#111827]">{form.title || "Property title"}</h4>
                <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">
                  {[form.areaLocality, form.city, form.district, form.state].filter(Boolean).join(", ") || "Location preview"}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-base-100 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-base-content/50">Rent</p>
                  <p className="text-2xl font-extrabold text-[#d92f71]">Rs. {form.price || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-base-content/50">Deposit</p>
                  <p className="text-sm font-semibold text-[#111827]">{form.securityDeposit ? `Rs. ${form.securityDeposit}` : "On request"}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <ShieldCheck className="size-3.5 text-[#0f9f8f]" />
                    Availability
                  </div>
                  <p className="mt-1 font-semibold text-base-content">{form.availabilityStatus || "AVAILABLE"}</p>
                </div>
                <div className="rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <BedDouble className="size-3.5 text-[#0f9f8f]" />
                    Furnishing
                  </div>
                  <p className="mt-1 font-semibold text-base-content">{form.furnishedStatus ? form.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
                </div>
                <div className="rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Wallet className="size-3.5 text-[#0f9f8f]" />
                    Sharing
                  </div>
                  <p className="mt-1 font-semibold text-base-content">{form.sharingType || "Not specified"}</p>
                </div>
                <div className="rounded-[16px] border border-base-300 bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <MapPin className="size-3.5 text-[#0f9f8f]" />
                    Listed by
                  </div>
                  <p className="mt-1 font-semibold text-base-content">{form.listedByType || "OWNER"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.amenities.slice(0, 4).map((amenity) => (
                  <span key={amenity} className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/70">
                    {amenity}
                  </span>
                ))}
                {form.amenities.length === 0 ? (
                  <span className="rounded-full border border-dashed border-base-300 bg-base-100 px-3 py-1 text-xs font-semibold text-base-content/45">
                    No amenities selected
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
