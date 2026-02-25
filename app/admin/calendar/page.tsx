"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, ExternalLink, Timer, CheckCircle2, Circle, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DrKartikCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [currentMonth]);

  async function fetchAllData() {
    setLoading(true);
    try {
      const { data: patients, error: pError } = await supabase.from("patients").select("*");
      const { data: appointments, error: aError } = await supabase.from("appointments").select("*");

      if (pError || aError) console.error("Fetch error:", pError || aError);

      const formattedEvents: any[] = [];

      // Process Patients
      patients?.forEach(p => {
        formattedEvents.push({
          id: p.id,
          date: p.registration_date,
          time: "09:00 AM",
          name: p.name,
          event: "Registration",
          note: p.chief_complaint || "",
          address: p.address || "Surat",
          patient_number: p.patient_number || "NEW",
          type: 'registration',
          is_completed: !!p.is_completed, // Force boolean
          table: 'patients' // <--- CRITICAL: Must match your Supabase table name exactly
        });
      });

      // Process Appointments
      appointments?.forEach(a => {
        formattedEvents.push({
          id: a.id,
          date: a.appointment_date || a.date, 
          time: a.time || "No Time",
          name: a.name || a.patient_name,
          event: a.service || a.service_type || "Follow-up",
          note: a.notes || "",
          patient_number: a.id.toString().slice(0,4),
          type: 'appointment',
          is_completed: !!a.is_completed, // Force boolean
          table: 'appointments' // <--- CRITICAL: Must match your Supabase table name exactly
        });
      });

      setAllEvents(formattedEvents);
    } catch (err) {
      console.error("System error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(eventId: string, currentStatus: boolean, table: string) {
    // Safety check: prevent the "Invalid relation name" error
    if (!table || typeof table !== 'string') {
      console.error("Error: Table name is missing for this event!");
      return; 
    }

    const newStatus = !currentStatus;
    
    // Optimistic Update
    setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, is_completed: newStatus } : ev));

    const { error } = await supabase
      .from(table) 
      .update({ is_completed: newStatus })
      .eq('id', eventId);

    if (error) {
      console.error("Update failed:", error);
      setAllEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, is_completed: currentStatus } : ev));
    }
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const selectedDayEvents = allEvents.filter(e => e.date === format(selectedDate, "yyyy-MM-dd"));
  
  // STATS CALCULATION
  const totalToday = selectedDayEvents.length;
  const completedToday = selectedDayEvents.filter(e => e.is_completed).length;
  const pendingToday = totalToday - completedToday;
  const progressPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
      
      {/* LEFT SIDE: CALENDAR GRID */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Agenda</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
              {format(currentMonth, "MMMM yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight size={16}/></button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-7 text-slate-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="py-2 text-center text-[9px] font-black uppercase tracking-tighter border-b border-slate-50">{d}</div>
          ))}
          {days.map((day, i) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = allEvents.filter(e => e.date === dateKey);
            const isSelected = isSameDay(day, selectedDate);
            const currentMonthDay = isSameMonth(day, currentMonth);
            
            return (
              <div 
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`relative border-r border-b border-slate-50 cursor-pointer transition-all flex flex-col items-center justify-center
                ${!currentMonthDay ? "bg-slate-50/50" : "hover:bg-blue-50/30"}
                ${isSelected ? "bg-blue-50/60 shadow-inner" : ""}`}
              >
                <span className={`text-sm font-semibold ${!currentMonthDay ? "text-slate-200" : isSelected ? "text-blue-700 font-black" : "text-slate-500"}`}>
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && currentMonthDay && (
                  <div className="mt-0.5 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded-full scale-90">
                    {dayEvents.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: DAILY STATS & LIST */}
      <aside className="w-[400px] bg-slate-50/50 flex flex-col border-l border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-blue-600 mb-1 font-black text-[9px] uppercase tracking-widest">
            <Timer size={12} /> {format(selectedDate, "do MMMM")}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">{format(selectedDate, "EEEE")}</h2>
          
          {/* STATS COUNTER BAR */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-center border-r border-slate-200">
              <p className="text-[8px] font-black text-slate-400 uppercase">Total</p>
              <p className="text-lg font-bold text-slate-800">{totalToday}</p>
            </div>
            <div className="text-center border-r border-slate-200">
              <p className="text-[8px] font-black text-emerald-500 uppercase">Done</p>
              <p className="text-lg font-bold text-emerald-600">{completedToday}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black text-blue-500 uppercase">Left</p>
              <p className="text-lg font-bold text-blue-600">{pendingToday}</p>
            </div>
          </div>
          
          {/* PROGRESS BAR */}
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
             <div 
               className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
               style={{ width: `${progressPercentage}%` }}
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.sort((a,b) => a.time.localeCompare(b.time)).map((event, idx) => (
              <div 
                key={idx} 
                className={`p-5 border rounded-3xl transition-all group relative
                  ${event.is_completed 
                    ? 'bg-slate-100/50 border-slate-200 grayscale-[0.2]' 
                    : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-white transition-colors ${event.is_completed ? 'bg-slate-400' : 'bg-blue-600'}`}>
                    <Clock size={14} />
                    <span className="text-xs font-black">{event.time}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleStatus(event.id, event.is_completed, event.table)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all font-black text-[9px] uppercase tracking-tighter
                      ${event.is_completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600'
                      }`}
                  >
                    {event.is_completed ? <CheckCircle2 size={12}/> : <Circle size={12}/>}
                    {event.is_completed ? "Completed" : "Mark Done"}
                  </button>
                </div>

                <h3 className={`text-lg font-bold mb-1 transition-all ${event.is_completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {event.name}
                </h3>
                
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border mb-4 
                  ${event.is_completed ? 'bg-slate-200 text-slate-500 border-slate-300' : 
                    event.type === 'registration' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{event.event}</span>
                </div>

                <div className={`mb-4 text-xs italic leading-snug line-clamp-2 ${event.is_completed ? 'text-slate-300' : 'text-slate-500'}`}>
                   {event.note || "No additional notes."}
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-300 text-[9px] font-bold uppercase">
                    <MapPin size={10} /> {event.address || "Surat"}
                  </div>
                  {event.type === 'registration' && (
                    <Link href={`/admin/patients/${event.id}`} className="text-blue-600 text-[9px] font-black uppercase hover:underline">
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-10">
              <Users size={32} className="mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">Free Day</p>
            </div>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}