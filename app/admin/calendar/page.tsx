"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, addMonths, subMonths, startOfMonth, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Sparkles, Plus, X, CheckCircle2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DrKartikCalendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Form State
  const [patientName, setPatientName] = useState("");
  const [treatment, setTreatment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const { data } = await supabase.from("appointments").select("*").eq("appointment_date", dateStr);
    if (data) setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from("appointments").insert([
      {
        patient_name: patientName,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedSlot,
        service_type: treatment,
        status: "confirmed"
      }
    ]);

    if (!error) {
      setPatientName("");
      setTreatment("");
      setIsDrawerOpen(false);
      fetchAppointments();
    }
    setLoading(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  return (
    <div className="min-h-screen p-4 lg:p-8 relative overflow-hidden">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-blue-600 mb-2 font-bold uppercase tracking-widest text-xs">
            <Sparkles size={16} /> 7th Heaven Admin
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900">Dr. Kartik's <span className="text-blue-600">Agenda</span></h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-3xl border border-white shadow-xl">
          <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
          <span className="font-bold px-4">{format(viewDate, "MMMM yyyy")}</span>
          <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MINI CALENDAR */}
        <aside className="lg:col-span-4 bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-2xl h-fit">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-gray-300 mb-4 uppercase">
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {eachDayOfInterval({
              start: startOfWeek(startOfMonth(viewDate)),
              end: addDays(startOfWeek(startOfMonth(viewDate)), 34)
            }).map((day) => (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                  isSameDay(day, selectedDate) ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-50 text-gray-600"
                }`}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </aside>

        {/* TIMELINE */}
        <section className="lg:col-span-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{format(selectedDate, "EEEE, MMMM do")}</h2>
          {hours.map((hour) => {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            const booking = appointments.find(a => a.appointment_time === timeStr);
            
            return (
              <div key={timeStr} className="flex gap-6 items-center group">
                <span className="w-16 text-right text-xs font-black text-gray-300 uppercase">{hour > 12 ? hour-12 : hour} {hour >= 12 ? 'PM' : 'AM'}</span>
                <div 
                  onClick={() => { if(!booking) { setSelectedSlot(timeStr); setIsDrawerOpen(true); }}}
                  className={`flex-1 min-h-[85px] rounded-[2rem] border-2 transition-all cursor-pointer flex items-center px-8 ${
                    booking ? "bg-white border-blue-100 shadow-md" : "border-dashed border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                  }`}
                >
                  {booking ? (
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">{booking.patient_name[0]}</div>
                        <div>
                          <p className="font-bold text-gray-900">{booking.patient_name}</p>
                          <p className="text-xs text-blue-500 font-bold uppercase tracking-tighter">{booking.service_type}</p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-green-500" size={20} />
                    </div>
                  ) : (
                    <span className="text-gray-300 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to book {timeStr}</span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* DR. KARTIK'S QUICK DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 p-10 flex flex-col"
            >
              <button onClick={() => setIsDrawerOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X /></button>
              
              <div className="mb-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={24} /></div>
                <h2 className="text-3xl font-bold text-gray-900">Quick Book</h2>
                <p className="text-gray-500 font-medium">{format(selectedDate, "MMM do")} at {selectedSlot}</p>
              </div>

              <form onSubmit={handleQuickSave} className="space-y-8 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Patient Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input autoFocus required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Ex: Mr. Sharma" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Treatment / Notes</label>
                  <input required value={treatment} onChange={(e) => setTreatment(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Ex: Filling / Consultation" />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Saving..." : "Confirm Appointment"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}