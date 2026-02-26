"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Users, Calendar as CalendarIcon, Clock, CheckCircle, Trash2 } from "lucide-react";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  appointment_date?: string; 
  time: string;
  status: string;
};

type FilterType = "all" | "pending" | "confirmed" | "rejected";

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const clearAppointmentDots = async () => {
      await supabase.from('appointments').update({ is_read: true }).eq('is_read', false);
      window.dispatchEvent(new Event("new_appointment_received"));
    };
    if (!loading) clearAppointmentDots();
  }, [loading]);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) router.push("/admin/login");
  }

  async function fetchAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAppointments(data);
    setLoading(false);
  }

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function updateStatus(appt: Appointment, newStatus: string) {
    if (newStatus === "confirmed") {
      const { data: existing } = await supabase
        .from("patients")
        .select("id")
        .eq("name", appt.name)
        .single();

      if (!existing) {
        await supabase.from("patients").insert([{
          name: appt.name,
          phone: appt.phone,
          registration_date: new Date().toISOString().split('T')[0],
          chief_complaint: appt.service || "Website Booking",
          notes: "" 
        }]);
      }
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appt.id);

    if (!error) {
      showToast(`Success! ${appt.name} is now ${newStatus}.`);
      fetchAppointments();
    }
  }

  async function deleteAppointment(id: number, name: string) {
    if (confirm(`Are you sure you want to permanently delete the lead for ${name}?`)) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (!error) {
        showToast(`Record for ${name} has been removed.`);
        setAppointments(prev => prev.filter(a => a.id !== id));
      } else {
        alert("Delete failed: " + error.message);
      }
    }
  }

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch = 
      appt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      appt.phone.includes(searchQuery);
    
    const matchesFilter = filter === "all" ? true : appt.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    today: appointments.filter(a => (a.appointment_date || a.date) === new Date().toISOString().split("T")[0]).length
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-50 font-black text-blue-600 uppercase tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 overflow-x-auto">
      
      {toastMessage && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-5 fade-in bg-white border-l-4 border-blue-600 shadow-2xl rounded-xl p-4 font-bold">
          {toastMessage}
        </div>
      )}

      <main className="min-w-[1100px] max-w-7xl mx-auto px-6 pt-12 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight bg-gradient-to-r from-black via-gray-600 to-blue-300 animate-gradient bg-clip-text text-transparent">Welcome, Dr. Kartik</h1>
            <p className="text-slate-500 font-medium italic">Monitor incoming leads and Old Records.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/patients" className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <Users size={14} /> Patient Directory
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={appointments.length} icon={<Users size={16}/>} />
          <StatCard title="Today" value={stats.today} color="text-blue-600" icon={<CalendarIcon size={16}/>} />
          <StatCard title="Pending" value={stats.pending} color="text-amber-600" icon={<Clock size={16}/>} />
          <StatCard title="Confirmed" value={stats.confirmed} color="text-emerald-600" icon={<CheckCircle size={16}/>} />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              />
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto max-w-full">
              {["all", "pending", "confirmed", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === f ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-5">Patient</th>
                  <th className="px-8 py-5">Requested Service</th>
                  <th className="px-8 py-5">Date/Time</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <Link href={`/admin/patients`} className="hover:underline">
                          <div className="font-bold text-slate-900">{appt.name}</div>
                        </Link>
                        <div className="text-xs text-slate-400 font-medium">{appt.phone}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{appt.service}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700">{appt.appointment_date || appt.date}</div>
                        <div className="text-[10px] font-black text-blue-500 uppercase">{appt.time}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          appt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          appt.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            appt.status === 'pending' ? 'bg-amber-500' :
                            appt.status === 'confirmed' ? 'bg-emerald-500' :
                            appt.status === 'rejected' ? 'bg-rose-500' : 'bg-blue-500'
                          }`} />
                          {appt.status}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          
                          {/* RECIPROCAL LOGIC: Accept button shows for Pending and Rejected */}
                          {(appt.status === 'pending' || appt.status === 'rejected') && (
                            <button onClick={() => updateStatus(appt, "confirmed")} className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-700 transition-all">Accept</button>
                          )}
                          
                          

                          {/* RECIPROCAL LOGIC: Reject button shows for Pending and Confirmed */}
                          {(appt.status === 'pending' || appt.status === 'confirmed') && (
                            <button onClick={() => updateStatus(appt, "rejected")} className="px-4 py-2 text-rose-600 text-[10px] font-black uppercase rounded-xl hover:bg-rose-50 transition-all">Reject</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching leads found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: number; color?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
        <h3 className={`text-2xl font-bold ${color || "text-slate-900"}`}>{value}</h3>
      </div>
    </div>
  );
}