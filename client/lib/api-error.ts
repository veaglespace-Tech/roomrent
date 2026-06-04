import axios from "axios";

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string>;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      const firstFieldError = Object.values(data.errors).find(Boolean);
      if (firstFieldError) {
        return firstFieldError;
      }
    }

    if (data?.message) {
      return data.message;
    }
  }

  return fallback;
}
