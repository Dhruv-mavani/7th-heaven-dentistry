"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: string; 
};

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);

  const [customMessage, setCustomMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "whatsapp">("whatsapp");

  useEffect(() => {
    // We create a single setup function to run everything in the correct order
    async function setupDashboard() {
      // 1. Verify the admin is logged in FIRST
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/admin/login");
        return;
      }

      // 2. Once verified, fetch the initial messages
      await fetchInquiries();

      // 3. NOW, open the Realtime channel as an authenticated admin
      const messageSubscription = supabase
        .channel('custom-insert-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contact_messages' },
          (payload) => {
            console.log("RECEIVED REALTIME PAYLOAD:", payload); // For debugging
            
            const newMessage = payload.new as ContactMessage;
            
            // Add the new message to the top of the table instantly
            setInquiries((prevInquiries) => [newMessage, ...prevInquiries]);
            
            // Show the on-screen notification
            showToast(`🔔 New inquiry received from ${newMessage.name}!`);
          }
        )
        .subscribe((status) => {
          console.log("REALTIME CONNECTION STATUS:", status); // For debugging
        });

      // Cleanup function to close the channel if you leave the page
      return () => {
        supabase.removeChannel(messageSubscription);
      };
    }

    setupDashboard();
  }, []); // Empty dependency array means this runs once on load

  // Fetch function stays mostly the same
  async function fetchInquiries() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      setDbError(error.message);
    } else if (data) {
      setInquiries(data);
    }
    setLoading(false);
  }

  async function markAsReplied(id: string) {
    await supabase
      .from("contact_messages")
      .update({ status: "replied" })
      .eq("id", id);
      
    showToast("Message marked as replied!");
    fetchInquiries(); 
  }

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000); // Increased to 5 seconds so they have time to read it
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient || !customMessage) return;
    
    showToast(`Message sent to ${selectedPatient} via ${selectedChannel.toUpperCase()}`);
    setCustomMessage("");
    setSelectedPatient("");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="relative w-24 h-24 mb-6 animate-pulse drop-shadow-lg">
          <Image src="/images/logo.png" alt="Loading..." fill className="object-contain" priority />
        </div>
        <div className="flex items-center gap-3 text-blue-800 font-medium tracking-wide">
          <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans flex text-gray-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-10 right-10 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-white/80 backdrop-blur-xl border border-blue-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 text-blue-800 font-medium">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {toastMessage}
          </div>
        </div>
      )}


      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 ml-6 overflow-y-auto z-10">
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
          
          <header>
            <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Patient Inquiries</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage messages submitted from the 7th Heaven website.</p>
          </header>

          <div className="flex flex-col gap-8">
            
            {/* Quick Reply Form */}
            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Reply</h3>
              
              <form onSubmit={handleSendMessage} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Patient Phone / Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +91 9876543210"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Channel</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setSelectedChannel("whatsapp")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${selectedChannel === "whatsapp" ? "bg-green-100/80 border-green-300 text-green-700 shadow-sm" : "bg-white/40 border-transparent text-gray-500 hover:bg-white/60"}`}>WhatsApp</button>
                      <button type="button" onClick={() => setSelectedChannel("sms")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${selectedChannel === "sms" ? "bg-blue-100/80 border-blue-300 text-blue-700 shadow-sm" : "bg-white/40 border-transparent text-gray-500 hover:bg-white/60"}`}>SMS Text</button>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all">
                    Send Reply
                  </button>
                </div>

                <div className="md:col-span-2 h-full flex flex-col">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    placeholder="Type your reply here..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="flex-1 w-full px-5 py-4 rounded-xl bg-white/60 border border-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 resize-none shadow-sm min-h-[150px]"
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Real Supabase Data Table */}
            <div className="rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-white/50 bg-white/20">
                <h3 className="text-xl font-bold text-gray-800">Recent Website Messages</h3>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/30 text-gray-500 text-xs uppercase tracking-widest font-semibold">
                    <tr>
                      <th className="p-6">Patient Info</th>
                      <th className="p-6 w-1/2">Message</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    
                    {dbError && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-red-500 font-bold bg-red-50/50">
                          Database Error: {dbError} 
                          <br/> <span className="text-sm font-normal text-gray-500 mt-2 block">Please check your Supabase table name and RLS policies.</span>
                        </td>
                      </tr>
                    )}

                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-white/40 transition-colors duration-200 group">
                        
                        <td className="p-6 min-w-[200px]">
                          <div className="font-bold text-gray-900 text-base">{inquiry.name}</div>
                          <div className="text-sm text-gray-500 font-medium mt-1">{inquiry.phone}</div>
                          <div className="text-xs text-gray-400 mt-1">{formatDate(inquiry.created_at)}</div>
                        </td>
                        
                        <td className="p-6">
                          <div className="text-gray-800 font-medium text-sm whitespace-pre-wrap">
                            {inquiry.message}
                          </div>
                          {inquiry.status && (
                            <div className="mt-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                                inquiry.status.toLowerCase() === "new" ? "bg-yellow-100/80 border-yellow-200 text-yellow-800" :
                                inquiry.status.toLowerCase() === "replied" ? "bg-green-100/80 border-green-200 text-green-800" :
                                "bg-gray-100/80 border-gray-200 text-gray-600"
                              }`}>
                                {inquiry.status.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="p-6 text-right align-top">
                           {inquiry.status?.toLowerCase() !== 'replied' && (
                             <div className="flex flex-col gap-2 items-end">
                               <button 
                                 onClick={() => {
                                   setSelectedPatient(inquiry.phone || inquiry.name);
                                   window.scrollTo({ top: 0, behavior: 'smooth' }); 
                                 }}
                                 className="px-4 py-2 bg-white/60 border border-white/80 hover:bg-blue-50 hover:border-blue-200 text-blue-700 text-sm font-semibold rounded-xl shadow-sm transition-all w-36 text-center"
                               >
                                 Reply
                               </button>
                               <button 
                                 onClick={() => markAsReplied(inquiry.id)}
                                 className="px-4 py-2 bg-white/60 border border-white/80 hover:bg-green-50 hover:border-green-200 text-green-700 text-sm font-semibold rounded-xl shadow-sm transition-all w-36 text-center"
                               >
                                 Mark Resolved
                               </button>
                             </div>
                           )}
                        </td>

                      </tr>
                    ))}
                    
                    {!dbError && inquiries.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-gray-500 font-medium">
                          No messages from the website yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}