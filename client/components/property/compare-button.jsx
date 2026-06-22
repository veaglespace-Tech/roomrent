"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { isCompared, toggleCompared } from "@/lib/compare-store";
export function CompareButton({ propertyId, compact }) {
    const [compared, setCompared] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        let active = true;
        const sync = async () => {
            setCompared(await isCompared(propertyId));
        };
        void sync();
        const refresh = async () => {
            if (active) {
                setCompared(await isCompared(propertyId));
            }
        };
        window.addEventListener("roomrent-compare-updated", refresh);
        return () => {
            active = false;
            window.removeEventListener("roomrent-compare-updated", refresh);
        };
    }, [propertyId]);
    return (_jsxs("button", { type: "button", className: `action-button ${compared ? "action-button-active" : ""} ${compact ? "min-h-10 px-3 py-2 text-xs" : ""}`, disabled: loading, onClick: async () => {
            try {
                setLoading(true);
                const result = await toggleCompared(propertyId);
                setCompared(result.compared);
            }
            catch {
                setCompared(false);
            }
            finally {
                setLoading(false);
            }
        }, children: [_jsx(Shuffle, { className: "size-4" }), loading ? "Updating..." : compared ? "Remove compare" : "Compare"] }));
}
