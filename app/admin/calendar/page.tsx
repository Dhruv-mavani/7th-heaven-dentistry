"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, ExternalLink, Timer, Sparkles, Users } from "lucide-react";
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
    const { data: patients } = await supabase.from("patients").select("*");
    const { data: appointments } = await supabase.from("appointments").select("*");

    const formattedEvents: any[] = [];

    patients?.forEach(p => {
      formattedEvents.push({
        id: p.id,
        date: p.registration_date,
        time: "09:00 AM",
        name: p.name,
        event: "Registration",
        note: p.chief_complaint,
        address: p.address,
        patient_number: p.patient_number,
        type: 'registration'
      });
    });

    appointments?.forEach(a => {
      formattedEvents.push({
        id: a.id,
        date: a.appointment_date || a.date, 
        time: a.time || "No Time",
        name: a.name || a.patient_name,
        event: a.service || a.service_type || "Follow-up",
        note: a.notes || "",
        patient_number: a.id.slice(0,4),
        type: 'appointment'
      });
    });

    setAllEvents(formattedEvents);
    setLoading(false);
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const selectedDayEvents = allEvents.filter(e => e.date === format(selectedDate, "yyyy-MM-dd"));

  return (
    // h-screen + overflow-hidden prevents the whole page from scrolling
    <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
      
      {/* LEFT SIDE: COMPACT CALENDAR */}
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

        {/* Calendar Grid - uses flex-1 to fill remaining space without scrolling */}
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

      {/* RIGHT SIDE: SCROLLABLE LIST (The only part that scrolls) */}
      <aside className="w-[400px] bg-slate-50/50 flex flex-col border-l border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-blue-600 mb-1 font-black text-[9px] uppercase tracking-widest">
            <Timer size={12} /> {format(selectedDate, "do MMMM")}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{format(selectedDate, "EEEE")}</h2>
        </div>

        {/* This div handles internal scrolling for many appointments */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.sort((a,b) => a.time.localeCompare(b.time)).map((event, idx) => (
              <div key={idx} className="p-5 bg-white border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-xl">
                    <Clock size={14} />
                    <span className="text-xs font-black">{event.time}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-300">#{event.patient_number}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {event.name}
                </h3>
                
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border mb-4 ${event.type === 'registration' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{event.event}</span>
                </div>

                <div className="mb-4 text-xs text-slate-500 italic leading-snug line-clamp-2">
                   {event.note || "No additional notes."}
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase">
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