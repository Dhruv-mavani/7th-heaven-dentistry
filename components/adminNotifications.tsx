"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminNotifications() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let messageSubscription: any;

    async function setupGlobalListener() {
      // 1. Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      
      // If they aren't logged in, don't start listening
      if (!session) return; 

      // 2. Inject Auth Token for RLS
      supabase.realtime.setAuth(session.access_token);

      // 3. Start listening globally!
      messageSubscription = supabase
        .channel('global-contact-messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contact_messages' },
          (payload) => {

            // 1. Show the toast (your existing code)
            setToastMessage(`New inquiry from ${payload.new.name}`);

            // 2. Alert the Sidebar to update the badge
            window.dispatchEvent(new Event("new_inquiry_received"));

            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
            audio.play().catch(e => console.log("Sound played after user interaction."));
            const newMessage = payload.new;
            
            // Show the global toast notification
            setToastMessage(`🔔 New patient inquiry from ${newMessage.name}!`);
            
            // Auto-hide after 5 seconds
            setTimeout(() => setToastMessage(null), 5000);
          }
        )
        .subscribe();
    }

    setupGlobalListener();

    return () => {
      if (messageSubscription) {
        supabase.removeChannel(messageSubscription);
      }
    };
  }, []);

  // If there's no message, render absolutely nothing
  if (!toastMessage) return null;

  // If there is a message, render the premium toast over everything! z-[9999] guarantees it's on top.
  return (
    <div className="fixed top-10 right-10 z-[9999] animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-2xl p-4 flex items-center gap-3 text-blue-800 font-bold tracking-wide">
        <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        {toastMessage}
      </div>
    </div>
  );
}