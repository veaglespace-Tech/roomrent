"use client";

import api from "@/services/api";
import { Property } from "@/types";

export interface CompareToggleResponse {
  compared: boolean;
  count: number;
}

let cachedIds: number[] | null = null;
let pendingLoad: Promise<number[]> | null = null;

function hasAuthToken() {
  return typeof window !== "undefined" && Boolean(window.localStorage.getItem("roomrent_token"));
}

function emitCompareUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("roomrent-compare-updated"));
  }
}

async function loadCompareIds(force = false) {
  if (!hasAuthToken()) {
    cachedIds = [];
    return cachedIds;
  }

  if (!force && cachedIds) {
    return cachedIds;
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  pendingLoad = api
    .get<Property[]>("/compare")
    .then(({ data }) => {
      cachedIds = data.map((property) => property.id);
      return cachedIds;
    })
    .catch(() => {
      cachedIds = [];
      return cachedIds;
    })
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function getCompareIds(force = false) {
  return loadCompareIds(force);
}

export async function isCompared(propertyId: number) {
  const ids = await getCompareIds();
  return ids.includes(propertyId);
}

export async function toggleCompared(propertyId: number) {
  if (!hasAuthToken()) {
    throw new Error("Login required to compare properties.");
  }
  const { data } = await api.post<CompareToggleResponse>(`/compare/${propertyId}`);
  cachedIds = await loadCompareIds(true);
  emitCompareUpdated();
  return { ...data, ids: cachedIds };
}

export async function removeCompared(propertyId: number) {
  if (!hasAuthToken()) {
    return;
  }
  await api.delete(`/compare/${propertyId}`);
  cachedIds = await loadCompareIds(true);
  emitCompareUpdated();
}

export async function clearCompareIds() {
  if (!hasAuthToken()) {
    cachedIds = [];
    return;
  }
  await api.delete("/compare");
  cachedIds = [];
  emitCompareUpdated();
}
