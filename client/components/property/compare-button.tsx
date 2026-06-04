"use client";

import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { isCompared, toggleCompared } from "@/lib/compare-store";

interface CompareButtonProps {
  propertyId: number;
  compact?: boolean;
}

export function CompareButton({ propertyId, compact }: CompareButtonProps) {
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

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition ${
        compared ? "border-[#0f9f8f]/25 bg-[#ecfdf8] text-[#0f766e]" : "border-base-300 bg-white text-[#111827] hover:border-[#ef3d81]/25 hover:text-[#ef3d81]"
      } ${compact ? "px-3 py-2 text-xs" : ""}`}
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          const result = await toggleCompared(propertyId);
          setCompared(result.compared);
        } catch {
          setCompared(false);
        } finally {
          setLoading(false);
        }
      }}
    >
      <Shuffle className="size-4" />
      {loading ? "Updating..." : compared ? "Remove compare" : "Compare"}
    </button>
  );
}
