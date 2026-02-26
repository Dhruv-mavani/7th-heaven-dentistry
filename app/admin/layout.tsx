"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import AdminNotifications from "@/components/adminNotifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current page is the login page
  const isLoginPage = pathname === "/admin/login";

  const [sidebarOpen, setSidebarOpen] = useState(true);

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

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
  />
)}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* Hamburger Button (Mobile Only) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-15 left-0 z-[60] p-1 shadow"
        >
          ☰
        </button>

        {children}
      </main>
    </div>
  );
}