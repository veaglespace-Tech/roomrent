import api from "@/services/api";
import { AdminDashboard, Enquiry, IngestionRun, ListingSource, Property, UserProfile } from "@/types";

export const getProfile = async () => {
  const { data } = await api.get<UserProfile>("/users/me");
  return data;
};

export const getSavedProperties = async () => {
  const { data } = await api.get<Property[]>("/saved");
  return data;
};

export const toggleSaveProperty = async (propertyId: number) => {
  const { data } = await api.post<{ saved: boolean; message: string }>("/save", { propertyId });
  return data;
};

export const sendEnquiry = async (propertyId: number, message: string) => {
  const { data } = await api.post<Enquiry>("/enquiry", { propertyId, message });
  return data;
};

export const getMyEnquiries = async () => {
  const { data } = await api.get<Enquiry[]>("/users/enquiries");
  return data;
};

export const getOwnerEnquiries = async () => {
  const { data } = await api.get<Enquiry[]>("/owner/enquiries");
  return data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard");
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get<UserProfile[]>("/admin/users");
  return data;
};

export const getListingSources = async () => {
  const { data } = await api.get<ListingSource[]>("/admin/sources");
  return data;
};

export const createListingSource = async (payload: {
  sourceName: string;
  sourceDomain: string;
  allowedForIngestion: boolean;
  termsStatus: string;
  notes?: string;
}) => {
  const { data } = await api.post<ListingSource>("/admin/sources", payload);
  return data;
};

export const getIngestionRuns = async () => {
  const { data } = await api.get<IngestionRun[]>("/admin/ingestion-runs");
  return data;
};

export const enqueueIngestionRun = async (payload: { sourceId: number; notes?: string }) => {
  const { data } = await api.post<IngestionRun>("/admin/ingestion-runs", payload);
  return data;
};
