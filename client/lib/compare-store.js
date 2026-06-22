"use client";
import api from "@/services/api";
import { getStoredAuthRole } from "@/lib/auth-session";
let cachedIds = null;
let pendingLoad = null;
function hasAuthToken() {
    return typeof window !== "undefined" && Boolean(getStoredAuthRole());
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
        .get("/compare")
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
export async function isCompared(propertyId) {
    const ids = await getCompareIds();
    return ids.includes(propertyId);
}
export async function toggleCompared(propertyId) {
    if (!hasAuthToken()) {
        throw new Error("Login required to compare properties.");
    }
    const { data } = await api.post(`/compare/${propertyId}`);
    cachedIds = await loadCompareIds(true);
    emitCompareUpdated();
    return { ...data, ids: cachedIds };
}
export async function removeCompared(propertyId) {
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
