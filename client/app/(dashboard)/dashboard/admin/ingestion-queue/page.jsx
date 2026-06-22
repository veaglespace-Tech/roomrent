"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ListPlus } from "lucide-react";
import { enqueueIngestionRun, getIngestionRuns, getListingSources } from "@/services/user-service";
export default function IngestionQueuePage() {
    const [sources, setSources] = useState([]);
    const [runs, setRuns] = useState([]);
    const [sourceId, setSourceId] = useState("");
    const [notes, setNotes] = useState("");
    const loadPage = () => {
        getListingSources().then(setSources).catch(() => setSources([]));
        getIngestionRuns().then(setRuns).catch(() => setRuns([]));
    };
    useEffect(() => {
        loadPage();
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!sourceId) {
            return;
        }
        await enqueueIngestionRun({ sourceId: Number(sourceId), notes });
        setNotes("");
        loadPage();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("form", { onSubmit: handleSubmit, className: "panel grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]", children: [_jsxs("div", { className: "md:col-span-3", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Ingestion Queue" }), _jsx("p", { className: "mt-2 text-base-content/70", children: "Queue compliant source runs for parsing, normalization, deduplication, and moderation." })] }), _jsxs("select", { className: "form-select", value: sourceId, onChange: (e) => setSourceId(e.target.value), children: [_jsx("option", { value: "", children: "Select source" }), sources.map((source) => _jsx("option", { value: source.id, children: source.sourceName }, source.id))] }), _jsx("input", { className: "form-input", placeholder: "Queue notes", value: notes, onChange: (e) => setNotes(e.target.value) }), _jsxs("button", { type: "submit", className: "btn pink-button rounded-[14px]", children: [_jsx(ListPlus, { className: "size-4" }), "Queue Run"] })] }), _jsx("div", { className: "panel overflow-x-auto p-6", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Source" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Fetched" }), _jsx("th", { children: "Parsed" }), _jsx("th", { children: "Published" }), _jsx("th", { children: "Errors" })] }) }), _jsx("tbody", { children: runs.map((run) => (_jsxs("tr", { children: [_jsx("td", { children: run.sourceName }), _jsx("td", { children: run.status }), _jsx("td", { children: run.fetchedCount }), _jsx("td", { children: run.parsedCount }), _jsx("td", { children: run.publishedCount }), _jsx("td", { children: run.errorCount })] }, run.id))) })] }) })] }));
}
