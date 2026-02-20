"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnreadAppts, setHasUnreadAppts] = useState(false); // New state for appointments

  // 1. Check for Patient Inquiries (Messages)
  const checkMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('id').eq('is_read', false).limit(1);
    setHasUnreadMessages(data && data.length > 0 ? true : false);
  };

  // 2. Check for New Appointments
  const checkAppointments = async () => {
    const { data } = await supabase.from('appointments').select('id').eq('is_read', false).limit(1);
    setHasUnreadAppts(data && data.length > 0 ? true : false);
  };

  useEffect(() => {
    checkMessages();
    checkAppointments();

    // Listen for events from the global AdminNotifications listener
    window.addEventListener("new_inquiry_received", checkMessages);
    window.addEventListener("new_appointment_received", checkAppointments);
    
    return () => {
      window.removeEventListener("new_inquiry_received", checkMessages);
      window.removeEventListener("new_appointment_received", checkAppointments);
    };
  }, []);

  return (
    <aside className="w-72 m-6 mr-0 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm p-8 flex flex-col justify-between h-[calc(100vh-48px)]">
      <div>
        <div className="flex items-center gap-3 mb-12">
           <Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={48} 
  height={48} 
  className="object-contain"
  style={{ height: 'auto' }} // This fixes the warning
/>
           <h2 className="text-2xl font-serif font-bold text-gray-900">7th Heaven</h2>
        </div>

        <nav className="space-y-3">
          {/* DASHBOARD LINK with BLUE DOT */}
          <Link href="/admin/dashboard" className={`relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
            pathname === '/admin/dashboard' ? "bg-white/60 shadow-sm text-blue-700 font-semibold border border-white/80" : "text-gray-500 hover:text-blue-600"
          }`}>
            <LayoutDashboard size={20} />
            Dashboard
            {hasUnreadAppts && (
              <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </Link>

          {/* MESSAGES LINK with RED DOT */}
          <Link href="/admin/messages" className={`relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
            pathname === '/admin/messages' ? "bg-white/60 shadow-sm text-blue-700 font-semibold border border-white/80" : "text-gray-500 hover:text-blue-600"
          }`}>
            <MessageSquare size={20} />
            Patient Inquiries
            {hasUnreadMessages && (
              <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </Link>
        </nav>
      </div>
      {/* ... logout button ... */}
    </aside>
  );
}