import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

