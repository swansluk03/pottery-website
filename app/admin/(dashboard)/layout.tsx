import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f3ef] md:flex">
      <AdminNav />
      <div className="flex-1 p-6 sm:p-8">{children}</div>
    </div>
  );
}
