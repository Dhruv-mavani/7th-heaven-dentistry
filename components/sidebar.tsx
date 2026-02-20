"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);

  // Simple Red Dot Check
  const checkUnread = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('id')
      .eq('is_read', false)
      .limit(1);
    setHasUnread(data && data.length > 0 ? true : false);
  };

  useEffect(() => {
    checkUnread();
    // Listen for the signal from adminNotifications.tsx
    window.addEventListener("new_inquiry_received", checkUnread);
    return () => window.removeEventListener("new_inquiry_received", checkUnread);
  }, []);

  return (
    <aside className="w-72 m-6 mr-0 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="relative w-12 h-12 bg-white/60 rounded-xl p-1.5 border border-white/80">
             <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-1" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">7th Heaven</h2>
        </div>

        <nav className="space-y-3">
          <Link href="/admin/dashboard" className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
            pathname === '/admin/dashboard' ? "bg-white/60 shadow-sm text-blue-700 font-semibold" : "text-gray-500 hover:text-blue-600"
          }`}>
            Dashboard
          </Link>

          <Link href="/admin/messages" className={`relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
            pathname === '/admin/messages' ? "bg-white/60 shadow-sm text-blue-700 font-semibold" : "text-gray-500 hover:text-blue-600"
          }`}>
            Patient Inquiries
            {hasUnread && (
              <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </Link>
        </nav>
      </div>
    </aside>
  );
}