import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";
export default function ResetPasswordPage() {
    return (_jsx(Suspense, { fallback: _jsx("section", { className: "page-shell py-10", children: "Loading..." }), children: _jsx(ResetPasswordForm, {}) }));
}
