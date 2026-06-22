"use client";
import api from "@/services/api";
let cachedAlerts = null;
let pendingLoad = null;
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
        .get("/saved-searches")
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
export async function saveSearchAlert(label, filters) {
    const { data } = await api.post("/saved-searches", { label, filters });
    cachedAlerts = await loadAlerts(true);
    emitSavedSearchUpdated();
    return data;
}
export async function removeSearchAlert(id) {
    await api.delete(`/saved-searches/${id}`);
    cachedAlerts = await loadAlerts(true);
    emitSavedSearchUpdated();
    return cachedAlerts;
}
