import { PropertyForm } from "@/components/forms/property-form";

export default function AddPropertyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Add Property</h1>
      <p className="mt-2 text-base-content/70">Publish a new room or PG listing.</p>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}

