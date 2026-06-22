"use client";
import api from "@/services/api";
export const getProperties = async (filters = {}) => {
    const { data } = await api.get("/properties", {
        params: {
            ...filters,
            amenities: filters.amenities?.join(",") || undefined
        }
    });
    return data;
};
export const getSearchSuggestions = async (q) => {
    const { data } = await api.get("/properties/suggestions", { params: { q } });
    return data;
};
export const getPropertyById = async (id) => {
    const { data } = await api.get(`/properties/${id}`);
    return data;
};
export const createProperty = async (payload) => {
    const { data } = await api.post("/properties", payload);
    return data;
};
export const updateProperty = async (id, payload) => {
    const { data } = await api.put(`/properties/${id}`, payload);
    return data;
};
export const deleteProperty = async (id) => {
    await api.delete(`/properties/${id}`);
};
export const getOwnerProperties = async () => {
    const { data } = await api.get("/owner/properties");
    return data;
};
export const getAdminProperties = async () => {
    const { data } = await api.get("/admin/properties");
    return data;
};
