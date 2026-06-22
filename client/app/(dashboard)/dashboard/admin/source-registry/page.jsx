"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CheckCircle2, FileCheck2, Plus, XCircle } from "lucide-react";
import { createListingSource, getListingSources, moderateListingSource } from "@/services/user-service";
export default function SourceRegistryPage() {
    const [sources, setSources] = useState([]);
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
    const handleSubmit = async (event) => {
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
    const handleModeration = async (source, termsStatus, allowedForIngestion) => {
        await moderateListingSource(source.id, {
            allowedForIngestion,
            termsStatus,
            notes: source.notes || ""
        });
        loadSources();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("form", { onSubmit: handleSubmit, className: "panel grid gap-4 p-6 md:grid-cols-2", children: [_jsx("h1", { className: "text-3xl font-bold md:col-span-2", children: "Source Registry" }), _jsx("input", { className: "form-input", placeholder: "Source name", value: form.sourceName, onChange: (e) => setForm({ ...form, sourceName: e.target.value }) }), _jsx("input", { className: "form-input", placeholder: "Source domain", value: form.sourceDomain, onChange: (e) => setForm({ ...form, sourceDomain: e.target.value }) }), _jsx("select", { className: "form-select", value: form.termsStatus, onChange: (e) => setForm({ ...form, termsStatus: e.target.value }), children: ["PENDING", "REVIEWED", "APPROVED", "REJECTED"].map((status) => _jsx("option", { value: status, children: status }, status)) }), _jsxs("label", { className: "label cursor-pointer justify-start gap-3 rounded-[14px] border border-base-300 bg-white px-4 py-3 transition hover:border-[#ff385c]/25", children: [_jsx("input", { type: "checkbox", className: "checkbox checkbox-primary checkbox-sm", checked: form.allowedForIngestion, onChange: (e) => setForm({ ...form, allowedForIngestion: e.target.checked }) }), _jsx("span", { className: "label-text", children: "Allowed for ingestion" })] }), _jsx("textarea", { className: "form-textarea md:col-span-2", placeholder: "Notes", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }) }), _jsxs("button", { type: "submit", className: "btn pink-button rounded-[14px] md:col-span-2", children: [_jsx(Plus, { className: "size-4" }), "Add Source"] })] }), _jsx("div", { className: "panel overflow-x-auto p-6", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Domain" }), _jsx("th", { children: "Terms" }), _jsx("th", { children: "Allowed" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: sources.map((source) => (_jsxs("tr", { children: [_jsx("td", { children: source.sourceName }), _jsx("td", { children: source.sourceDomain }), _jsx("td", { children: source.termsStatus }), _jsx("td", { children: source.allowedForIngestion ? "Yes" : "No" }), _jsx("td", { children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs("button", { type: "button", className: "btn btn-xs rounded-[10px]", onClick: () => handleModeration(source, "REVIEWED", false), children: [_jsx(FileCheck2, { className: "size-3.5" }), " Review"] }), _jsxs("button", { type: "button", className: "btn btn-xs rounded-[10px] btn-success text-white", onClick: () => handleModeration(source, "APPROVED", true), children: [_jsx(CheckCircle2, { className: "size-3.5" }), " Approve"] }), _jsxs("button", { type: "button", className: "btn btn-xs rounded-[10px] btn-error text-white", onClick: () => handleModeration(source, "REJECTED", false), children: [_jsx(XCircle, { className: "size-3.5" }), " Reject"] })] }) })] }, source.id))) })] }) })] }));
}
