import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-shell py-8 md:py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <DashboardSidebar />
        <div className="dashboard-content-shell">
          {children}
        </div>
      </div>
    </section>
  );
}
