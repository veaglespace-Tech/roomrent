import api from "@/services/api";
export const getProfile = async () => {
    const { data } = await api.get("/users/me");
    return data;
};
export const activateSubscription = async (plan) => {
    const { data } = await api.post("/users/subscription", { plan });
    return data;
};
export const getSavedProperties = async () => {
    const { data } = await api.get("/saved");
    return data;
};
export const toggleSaveProperty = async (propertyId) => {
    const { data } = await api.post("/save", { propertyId });
    return data;
};
export const sendEnquiry = async (propertyId, message) => {
    const { data } = await api.post("/enquiry", { propertyId, message });
    return data;
};
export const requestLead = async (propertyId) => {
    const { data } = await api.post("/leads", { propertyId });
    return data;
};
export const getMyEnquiries = async () => {
    const { data } = await api.get("/users/enquiries");
    return data;
};
export const getOwnerEnquiries = async () => {
    const { data } = await api.get("/owner/enquiries");
    return data;
};
export const getOwnerLeads = async () => {
    const { data } = await api.get("/owner/leads");
    return data;
};
export const getAdminDashboard = async () => {
    const { data } = await api.get("/admin/dashboard");
    return data;
};
export const getAdminUsers = async () => {
    const { data } = await api.get("/admin/users");
    return data;
};
export const getListingSources = async () => {
    const { data } = await api.get("/admin/sources");
    return data;
};
export const createListingSource = async (payload) => {
    const { data } = await api.post("/admin/sources", payload);
    return data;
};
export const moderateListingSource = async (sourceId, payload) => {
    const { data } = await api.post(`/admin/sources/${sourceId}/moderate`, payload);
    return data;
};
export const getIngestionRuns = async () => {
    const { data } = await api.get("/admin/ingestion-runs");
    return data;
};
export const enqueueIngestionRun = async (payload) => {
    const { data } = await api.post("/admin/ingestion-runs", payload);
    return data;
};
export const updateProfile = async (payload) => {
    const { data } = await api.put("/users/profile", payload);
    return data;
};
export const updatePassword = async (payload) => {
    const { data } = await api.put("/users/password", payload);
    return data;
};
export const updateAdminUser = async (id, payload, role) => {
    const { data } = await api.put(`/admin/users/${id}`, payload, { params: { role } });
    return data;
};
export const deleteAdminUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
};
