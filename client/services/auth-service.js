"use client";
import api from "@/services/api";
export const registerUser = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
};
export const loginUser = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
};
export const logoutUser = async () => {
    const { data } = await api.post("/auth/logout");
    return data;
};
export const requestPasswordReset = async (payload) => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
};
export const resetPassword = async (payload) => {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
};
