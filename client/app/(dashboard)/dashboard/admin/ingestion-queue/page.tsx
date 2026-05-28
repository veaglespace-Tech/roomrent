"use client";

import { FormEvent, useEffect, useState } from "react";
import { ListPlus } from "lucide-react";
import { enqueueIngestionRun, getIngestionRuns, getListingSources } from "@/services/user-service";
import { IngestionRun, ListingSource } from "@/types";

export default function IngestionQueuePage() {
  const [sources, setSources] = useState<ListingSource[]>([]);
  const [runs, setRuns] = useState<IngestionRun[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [notes, setNotes] = useState("");

  const loadPage = () => {
    getListingSources().then(setSources).catch(() => setSources([]));
    getIngestionRuns().then(setRuns).catch(() => setRuns([]));
  };

  useEffect(() => {
    loadPage();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sourceId) {
      return;
    }
    await enqueueIngestionRun({ sourceId: Number(sourceId), notes });
    setNotes("");
    loadPage();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="panel grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold">Ingestion Queue</h1>
          <p className="mt-2 text-base-content/70">Queue compliant source runs for parsing, normalization, deduplication, and moderation.</p>
        </div>
        <select className="form-select" value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
          <option value="">Select source</option>
          {sources.map((source) => <option key={source.id} value={source.id}>{source.sourceName}</option>)}
        </select>
        <input className="form-input" placeholder="Queue notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" className="btn pink-button rounded-[14px]">
          <ListPlus className="size-4" />
          Queue Run
        </button>
      </form>

      <div className="panel overflow-x-auto p-6">
        <table className="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Status</th>
              <th>Fetched</th>
              <th>Parsed</th>
              <th>Published</th>
              <th>Errors</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>{run.sourceName}</td>
                <td>{run.status}</td>
                <td>{run.fetchedCount}</td>
                <td>{run.parsedCount}</td>
                <td>{run.publishedCount}</td>
                <td>{run.errorCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
