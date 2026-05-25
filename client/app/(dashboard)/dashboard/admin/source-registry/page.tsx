"use client";

import { FormEvent, useEffect, useState } from "react";
import { createListingSource, getListingSources } from "@/services/user-service";
import { ListingSource } from "@/types";

export default function SourceRegistryPage() {
  const [sources, setSources] = useState<ListingSource[]>([]);
  const [form, setForm] = useState({
    sourceName: "",
    sourceDomain: "",
    allowedForIngestion: false,
    termsStatus: "PENDING",
    notes: ""
  });

  const loadSources = () => {
    getListingSources().then(setSources).catch(() => setSources([]));
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await createListingSource(form);
    setForm({
      sourceName: "",
      sourceDomain: "",
      allowedForIngestion: false,
      termsStatus: "PENDING",
      notes: ""
    });
    loadSources();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="panel grid gap-4 p-6 md:grid-cols-2">
        <h1 className="text-3xl font-bold md:col-span-2">Source Registry</h1>
        <input className="input input-bordered w-full" placeholder="Source name" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Source domain" value={form.sourceDomain} onChange={(e) => setForm({ ...form, sourceDomain: e.target.value })} />
        <select className="select select-bordered w-full" value={form.termsStatus} onChange={(e) => setForm({ ...form, termsStatus: e.target.value })}>
          {["PENDING", "REVIEWED", "APPROVED", "REJECTED"].map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <label className="label cursor-pointer justify-start gap-3 rounded-2xl border border-base-300 px-4 py-3">
          <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={form.allowedForIngestion} onChange={(e) => setForm({ ...form, allowedForIngestion: e.target.checked })} />
          <span className="label-text">Allowed for ingestion</span>
        </label>
        <textarea className="textarea textarea-bordered md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit" className="btn btn-primary rounded-full md:col-span-2">Add Source</button>
      </form>

      <div className="panel overflow-x-auto p-6">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Terms</th>
              <th>Allowed</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id}>
                <td>{source.sourceName}</td>
                <td>{source.sourceDomain}</td>
                <td>{source.termsStatus}</td>
                <td>{source.allowedForIngestion ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
