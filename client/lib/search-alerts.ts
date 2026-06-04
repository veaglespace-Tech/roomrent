"use client";

import api from "@/services/api";
import { PropertyFilters } from "@/types";

export interface SavedSearchAlert {
  id: number;
  label: string;
  filters: PropertyFilters;
  createdAt: string;
}

export interface SavedSearchRequest {
  label: string;
  filters: PropertyFilters;
}

let cachedAlerts: SavedSearchAlert[] | null = null;
let pendingLoad: Promise<SavedSearchAlert[]> | null = null;

function emitSavedSearchUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("roomrent-saved-search-updated"));
  }
}

async function loadAlerts(force = false) {
  if (!force && cachedAlerts) {
    return cachedAlerts;
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  pendingLoad = api
    .get<SavedSearchAlert[]>("/saved-searches")
    .then(({ data }) => {
      cachedAlerts = data;
      return cachedAlerts;
    })
    .catch(() => {
      cachedAlerts = [];
      return cachedAlerts;
    })
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function getSavedSearchAlerts(force = false) {
  return loadAlerts(force);
}

export async function saveSearchAlert(label: string, filters: PropertyFilters) {
  const { data } = await api.post<SavedSearchAlert>("/saved-searches", { label, filters } satisfies SavedSearchRequest);
  cachedAlerts = await loadAlerts(true);
  emitSavedSearchUpdated();
  return data;
}

export async function removeSearchAlert(id: number) {
  await api.delete(`/saved-searches/${id}`);
  cachedAlerts = await loadAlerts(true);
  emitSavedSearchUpdated();
  return cachedAlerts;
}
