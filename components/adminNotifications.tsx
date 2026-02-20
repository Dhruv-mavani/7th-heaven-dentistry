"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminNotifications() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let globalChannel: any;

    async function startListening() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return; 

      supabase.realtime.setAuth(session.access_token);

      globalChannel = supabase
        .channel('admin-global-updates')
        // 1. LISTEN FOR APPOINTMENTS (Dashboard Blue Dot)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'appointments' },
          (payload) => {
            // Play Appointment Chime
            new Audio('/audios/notificationaudio.mp3').play().catch(() => {});
            
            setToastMessage(`New Appointment: ${payload.new.name}`);
            window.dispatchEvent(new Event("new_appointment_received"));
            setTimeout(() => setToastMessage(null), 5000);
          }
        )
        // 2. LISTEN FOR MESSAGES (Inquiries Red Dot)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contact_messages' },
          (payload) => {
            // Play Message Blip
            new Audio('/audios/notificationaudio.mp3').play().catch(() => {});
            
            setToastMessage(`🔔 New Inquiry: ${payload.new.name}`);
            window.dispatchEvent(new Event("new_inquiry_received"));
            setTimeout(() => setToastMessage(null), 5000);
          }
        )
        .subscribe();
    }

    startListening();

    return () => {
      if (globalChannel) supabase.removeChannel(globalChannel);
    };
  }, []);

  if (!toastMessage) return null;

  return (
    <div className="fixed top-10 right-10 z-[9999] animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-2xl p-4 flex items-center gap-3 text-blue-800 font-bold tracking-wide">
        <div className="bg-blue-500 p-2 rounded-full">
           <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
           </svg>
        </div>
        {toastMessage}
      </div>
    </div>
  );
}