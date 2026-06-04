import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<section className="page-shell py-10">Loading...</section>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
