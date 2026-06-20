"use client";

import api from "@/services/api";
import { PaginatedResponse, Property, PropertyFilters, PropertyPayload } from "@/types";

export const getProperties = async (filters: PropertyFilters = {}) => {
  const { data } = await api.get<PaginatedResponse<Property>>("/properties", {
    params: {
      ...filters,
      amenities: filters.amenities?.join(",") || undefined
    }
  });
  return data;
};

export const getSearchSuggestions = async (q: string) => {
  const { data } = await api.get<string[]>("/properties/suggestions", { params: { q } });
  return data;
};

export const getPropertyById = async (id: string | number) => {
  const { data } = await api.get<Property>(`/properties/${id}`);
  return data;
};

export const createProperty = async (payload: PropertyPayload) => {
  const { data } = await api.post<Property>("/properties", payload);
  return data;
};

export const updateProperty = async (id: string | number, payload: PropertyPayload) => {
  const { data } = await api.put<Property>(`/properties/${id}`, payload);
  return data;
};

export const deleteProperty = async (id: string | number) => {
  await api.delete(`/properties/${id}`);
};

export const getOwnerProperties = async () => {
  const { data } = await api.get<Property[]>("/owner/properties");
  return data;
};

export const getAdminProperties = async () => {
  const { data } = await api.get<Property[]>("/admin/properties");
  return data;
};
