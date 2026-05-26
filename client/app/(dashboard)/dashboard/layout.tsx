import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-shell py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <DashboardSidebar />
        <div className="min-w-0 rounded-[32px] border border-base-300/60 bg-white p-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.28)] md:p-6">
          {children}
        </div>
      </div>
    </section>
  );
}
