"use client";

import api from "@/services/api";
import { AuthResponse, Role } from "@/types";

export const registerUser = async (payload: {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const requestPasswordReset = async (payload: { email: string }) => {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", payload);
  return data;
};

export const resetPassword = async (payload: { token: string; newPassword: string }) => {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", payload);
  return data;
};
