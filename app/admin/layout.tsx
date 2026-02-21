"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import AdminNotifications from "@/components/adminNotifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current page is the login page
  const isLoginPage = pathname === "/admin/login";


  // If it's the login page, render WITHOUT the sidebar and extra padding
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  // Otherwise, render the full admin dashboard layout
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50 flex">
      <AdminNotifications />
      
      {/* Sidebar only shows for authenticated admin pages */}
      <Sidebar />

      <main className="flex-1 p-10 ml-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}