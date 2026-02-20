"use client";

import { useState, useEffect, useRef } from "react"; // Added useRef
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
  is_read: boolean;
};

export default function MessagesPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null); // Reference for the form
  
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);

  const [customMessage, setCustomMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"sms" | "whatsapp">("whatsapp");
  const [view, setView] = useState<"active" | "resolved">("active");

  useEffect(() => {
    let messageSubscription: any;

    async function setupDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      await fetchInquiries();

      await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("is_read", false);
      
      window.dispatchEvent(new Event("new_inquiry_received"));

      messageSubscription = supabase
        .channel('admin-messages-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contact_messages' },
          (payload) => {
            const newMessage = payload.new as ContactMessage;
            setInquiries((prev) => [newMessage, ...prev]);
            showToast(`🔔 New inquiry: ${newMessage.name}`);
            
            supabase
              .from("contact_messages")
              .update({ is_read: true })
              .eq("id", newMessage.id)
              .then(() => window.dispatchEvent(new Event("new_inquiry_received")));
          }
        )
        .subscribe();
    }

    setupDashboard();

    return () => {
      if (messageSubscription) supabase.removeChannel(messageSubscription);
    };
  }, [router]);

  async function fetchInquiries() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setDbError(error.message);
    } else if (data) {
      setInquiries(data);
    }
    setLoading(false);
  }

  async function markAsReplied(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "replied" })
      .eq("id", id);

    if (!error) {
      showToast("Moved to History.");
      setInquiries(prev => prev.map(msg => 
        msg.id === id ? { ...msg, status: 'replied' } : msg
      ));
    }
  }

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient || !customMessage) return;
    showToast(`Message sent to ${selectedPatient} via ${selectedChannel.toUpperCase()}`);
    setCustomMessage("");
    setSelectedPatient("");
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-800 font-medium">Loading messages...</p>
      </div>
    );
  }

  const filteredInquiries = inquiries.filter((msg) => {
    if (view === "active") return msg.status !== "replied";
    return msg.status === "replied";
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {toastMessage && (
        <div className="fixed top-10 right-10 z-[9999] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-white/90 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-2xl p-4 flex items-center gap-3 text-blue-800 font-medium">
            <span className="text-xl text-blue-500">🔔</span>
            {toastMessage}
          </div>
        </div>
      )}

      <header>
        <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Patient Inquiries</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage messages submitted from the website.</p>
      </header>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => setView("active")}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all border ${
            view === "active" 
            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
            : "bg-white/40 text-gray-500 border-white/60 hover:bg-white/60"
          }`}
        >
          Active ({inquiries.filter(m => m.status !== 'replied').length})
        </button>
        
        <button 
          onClick={() => setView("resolved")}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all border ${
            view === "resolved" 
            ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200" 
            : "bg-white/40 text-gray-500 border-white/60 hover:bg-white/60"
          }`}
        >
          History ({inquiries.filter(m => m.status === 'replied').length})
        </button>
      </div>

      {/* QUICK REPLY FORM (with Ref for scrolling) */}
      <div ref={formRef} className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-sm scroll-mt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Reply</h3>
        <form onSubmit={handleSendMessage} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Patient Contact</label>
              <input 
                type="text" 
                placeholder="Name or Phone"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Channel</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedChannel("whatsapp")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedChannel === "whatsapp" ? "bg-green-100 border-green-300 text-green-700" : "bg-white/40 text-gray-500"}`}>WhatsApp</button>
                <button type="button" onClick={() => setSelectedChannel("sms")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedChannel === "sms" ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white/40 text-gray-500"}`}>SMS</button>
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">Send Reply</button>
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message Content</label>
            <textarea 
              placeholder="Type your reply..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="flex-1 w-full px-5 py-4 rounded-xl bg-white/60 border border-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none min-h-[150px]"
            />
          </div>
        </form>
      </div>

      <div className="rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-white/50 bg-white/20">
          <h3 className="text-xl font-bold text-gray-800">Recent Messages</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/30 text-gray-500 text-xs uppercase tracking-widest font-semibold">
              <tr>
                <th className="p-6">Patient</th>
                <th className="p-6 w-1/2">Message</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {dbError && (
                <tr><td colSpan={3} className="p-12 text-center text-red-500 font-bold">{dbError}</td></tr>
              )}
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-white/40 transition-all">
                  <td className="p-6">
                    <div className="font-bold text-gray-900">{inquiry.name}</div>
                    <div className="text-sm text-gray-500">{inquiry.phone}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatDate(inquiry.created_at)}</div>
                  </td>
                  <td className="p-6">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{inquiry.message}</p>
                    {inquiry.status && (
                      <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${
                        inquiry.status === "replied" ? "bg-green-100 border-green-200 text-green-700" : "bg-yellow-100 border-yellow-200 text-yellow-700"
                      }`}>{inquiry.status.toUpperCase()}</span>
                    )}
                  </td>
                  <td className="p-6 text-right align-top space-y-2">
                    <button 
                      onClick={() => { 
                        setSelectedPatient(inquiry.phone || inquiry.name); 
                        // Scoll to form smoothly
                        formRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="block w-full px-4 py-2 bg-white/60 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl"
                    >Reply</button>
                    {inquiry.status !== "replied" && (
                      <button 
                        onClick={() => markAsReplied(inquiry.id)}
                        className="block w-full px-4 py-2 bg-white/60 border border-green-200 text-green-700 text-sm font-semibold rounded-xl"
                      >Mark Resolved</button>
                    )}
                  </td>
                </tr>
              ))}
              {!dbError && inquiries.length === 0 && (
                <tr><td colSpan={3} className="p-12 text-center text-gray-500">No messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}