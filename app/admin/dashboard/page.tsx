"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
};

type FilterType = "all" | "pending" | "confirmed" | "rescheduled" | "rejected";

export default function Dashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reschedule Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    checkUser();
    fetchAppointments();
  }, []);

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

  // Helper to show a temporary toast message
  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // --- NEW: Messaging Logic ---
  async function sendNotifications(appt: Appointment, action: string, updatedDate?: string, updatedTime?: string) {
    let patientMessage = "";
    let doctorMessage = "";

    // 1. Generate the specific messages based on the action
    if (action === "confirmed") {
      patientMessage = `Hello ${appt.name}, your appointment with 7th Heaven Family Dentistry for ${appt.service} on ${appt.date} at ${appt.time} is CONFIRMED. We look forward to seeing you!`;
      doctorMessage = `✅ CONFIRMED: ${appt.name} (${appt.phone}) for ${appt.service} on ${appt.date} at ${appt.time}.`;
    
    } else if (action === "rejected") {
      patientMessage = `Hello ${appt.name}, unfortunately, we are unable to accommodate your appointment request for ${appt.date}. Please call us to find a better time.`;
      doctorMessage = `❌ REJECTED: ${appt.name} requested ${appt.service} on ${appt.date}.`;
    
    } else if (action === "rescheduled") {
      patientMessage = `Hello ${appt.name}, your appointment at 7th Heaven has been RESCHEDULED to a new time: ${updatedDate} at ${updatedTime}. Reply to this message if you need to make changes.`;
      doctorMessage = `🔄 RESCHEDULED: ${appt.name} is now scheduled for ${updatedDate} at ${updatedTime} (${appt.service}).`;
    }

    // 2. Log them (Later, replace this with your SMS/WhatsApp API calls)
    console.log(`📱 [To Patient ${appt.phone}]:`, patientMessage);
    console.log(`🩺 [To Dr. Kartik]:`, doctorMessage);

    // Example API Call for later:
    // await fetch('/api/send-message', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     patient: { phone: appt.phone, message: patientMessage },
    //     doctor: { phone: "+91XXXXXXXXXX", message: doctorMessage }
    //   })
    // });
  }

  // Notice we now pass the full appointment object (appt) instead of just the ID
  async function updateStatus(appt: Appointment, newStatus: string) {
    // 1. Update Database
    await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appt.id);

    // 2. Send the Message
    await sendNotifications(appt, newStatus);
    
    // 3. Show Success Toast
    showToast(`Appointment ${newStatus}. Message sent to ${appt.name}.`);

    fetchAppointments();
  }

  async function handleRescheduleSave() {
    if (!editingAppt) return;

    // 1. Update Database
    await supabase
      .from("appointments")
      .update({
        date: newDate,
        time: newTime,
        status: "rescheduled",
      })
      .eq("id", editingAppt.id);

    // 2. Send the Message (passing the new date/time for the SMS)
    await sendNotifications(editingAppt, "rescheduled", newDate, newTime);
    
    // 3. Show Success Toast
    showToast(`Rescheduled! Message sent to ${editingAppt.name}.`);

    setIsModalOpen(false);
    setEditingAppt(null);
    fetchAppointments(); 
  }

  function openRescheduleModal(appt: Appointment) {
    setEditingAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setIsModalOpen(true);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // Calculate stats
  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const rescheduled = appointments.filter((a) => a.status === "rescheduled").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;
  const today = appointments.filter((a) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return a.date === todayStr;
  }).length;

  // Filter the table data
  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "all") return true;
    return appt.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="relative w-24 h-24 mb-6 animate-pulse drop-shadow-lg">
          <Image src="/images/logo.png" alt="Loading 7th Heaven Dashboard..." fill className="object-contain" priority />
        </div>
        <div className="flex items-center gap-3 text-blue-800 font-medium tracking-wide">
          <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          Preparing your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans flex text-gray-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-10 right-10 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-white/80 backdrop-blur-xl border border-green-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 text-green-800 font-medium">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {toastMessage}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 ml-6 overflow-y-auto z-10">
        <div className="max-w-7xl mx-auto space-y-10 pb-10">
          
          <header>
            <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Welcome, Dr. Patel
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Here is what is happening at your clinic today.
            </p>
          </header>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard title="Total" value={appointments.length} />
            <StatCard title="Today" value={today} highlight="blue" />
            <StatCard title="Pending" value={pending} highlight="yellow" />
            <StatCard title="Confirmed" value={confirmed} highlight="green" />
            <StatCard title="Rescheduled" value={rescheduled} highlight="purple" />
            <StatCard title="Rejected" value={rejected} highlight="red" />
          </div>

          {/* TABLE SECTION */}
          <div className="rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-8 py-5 border-b border-white/50 bg-white/20 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Appointments</h3>
              
              <div className="flex flex-wrap p-1 bg-white/40 rounded-2xl backdrop-blur-md border border-white/60">
                {(["all", "pending", "confirmed", "rescheduled", "rejected"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      filter === f
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/30 text-gray-500 text-xs uppercase tracking-widest font-semibold">
                  <tr>
                    <th className="p-6">Patient Details</th>
                    <th className="p-6">Service</th>
                    <th className="p-6">Schedule</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-white/40 transition-colors duration-200 group">
                      <td className="p-6">
                        <div className="font-bold text-gray-900 text-base">{appt.name}</div>
                        <div className="text-sm text-gray-500 mt-1 font-medium">{appt.phone}</div>
                      </td>
                      <td className="p-6 text-gray-700 font-medium">{appt.service}</td>
                      <td className="p-6">
                        <div className="text-gray-900 font-medium">{appt.date}</div>
                        <div className="text-sm text-gray-500">{appt.time}</div>
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
                            appt.status === "pending"
                              ? "bg-yellow-100/80 border-yellow-200 text-yellow-800"
                              : appt.status === "confirmed"
                              ? "bg-green-100/80 border-green-200 text-green-800"
                              : appt.status === "rescheduled"
                              ? "bg-purple-100/80 border-purple-200 text-purple-800"
                              : "bg-red-100/80 border-red-200 text-red-800"
                          }`}
                        >
                          {appt.status.toUpperCase()}
                        </span>
                      </td>
                      
                      {/* ACTION BUTTONS */}
                      <td className="p-6 flex justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                        
                        {/* Notice updateStatus now passes the whole 'appt' object */}
                        {appt.status !== "rescheduled" && appt.status !== "confirmed" && (
                          <button 
                            onClick={() => updateStatus(appt, "confirmed")} 
                            className="px-3 py-2 bg-white/60 border border-white/80 hover:bg-green-50 hover:border-green-200 text-green-700 text-sm font-semibold rounded-xl shadow-sm transition-all"
                          >
                            Accept
                          </button>
                        )}
                        
                        <button 
                          onClick={() => openRescheduleModal(appt)} 
                          className="px-3 py-2 bg-white/60 border border-white/80 hover:bg-blue-50 hover:border-blue-200 text-blue-700 text-sm font-semibold rounded-xl shadow-sm transition-all"
                        >
                          Reschedule
                        </button>
                        
                        {appt.status !== "rejected" && (
                          <button 
                            onClick={() => updateStatus(appt, "rejected")} 
                            className="px-3 py-2 bg-white/60 border border-white/80 hover:bg-red-50 hover:border-red-200 text-red-700 text-sm font-semibold rounded-xl shadow-sm transition-all"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        {filter === "all" ? "No appointments found." : `No ${filter} appointments found.`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* RESCHEDULE MODAL */}
      {isModalOpen && editingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              Reschedule Appointment
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Select a new date and time for <span className="font-bold text-gray-800">{editingAppt.name}</span>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSave}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: "blue" | "yellow" | "green" | "purple" | "red";
}) {
  return (
    <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </p>
      <h3
        className={`text-4xl font-bold ${
          highlight === "blue"
            ? "text-blue-600"
            : highlight === "yellow"
            ? "text-yellow-600"
            : highlight === "green"
            ? "text-green-600"
            : highlight === "purple"
            ? "text-purple-600"
            : highlight === "red"
            ? "text-red-600"
            : "text-gray-800"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}