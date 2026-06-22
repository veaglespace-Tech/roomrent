import axios from "axios";
export function getApiErrorMessage(error, fallback) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status && status >= 500) {
            return fallback;
        }
        const data = error.response?.data;
        if (data?.errors) {
            const firstFieldError = Object.values(data.errors).find(Boolean);
            if (firstFieldError) {
                return firstFieldError;
            }
        }
        if (data?.message) {
            if (/internal server error|exception|stack trace/i.test(data.message)) {
                return fallback;
            }
            return data.message;
        }
    }
    return fallback;
}
