// app/admin/layout.tsx
import Sidebar from "@/components/sidebar"; // We'll create this next
import AdminNotifications from "@/components/adminNotifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50 flex">
      <AdminNotifications />
      
      {/* This Sidebar stays put while you switch pages */}
      <Sidebar />

      <main className="flex-1 p-10 ml-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}