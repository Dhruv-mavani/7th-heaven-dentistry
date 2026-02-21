"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, Calendar, MapPin, AlertCircle, FileText, ClipboardList, 
  Plus, X, CheckCircle2, Star, Clock 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [patient, setPatient] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notes, setNotes] = useState(""); 

  // Follow-up Form State
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [nextVisitTime, setNextVisitTime] = useState("10:00"); // Default time
  const [nextService, setNextService] = useState("Consultation");
  const [nextServiceNotes, setNextServiceNotes] = useState(""); 

  useEffect(() => {
    async function getFullProfile() {
      setLoading(true);
      const { data: pData } = await supabase.from("patients").select("*").eq("id", patientId).single();

      if (pData) {
        setPatient(pData);
        setNotes(pData.notes || "");

        // Fetch all confirmed appointments for this patient name to build the timeline
        const { data: hData } = await supabase
          .from("appointments")
          .select("*")
          .eq("name", pData.name) 
          .eq("status", "confirmed")
          .order("date", { ascending: false });

        const registrationEvent = {
          id: 'reg-0',
          type: 'REGISTRATION',
          date: pData.registration_date,
          title: 'Joined 7th Heaven',
          subtitle: 'Clinic Registration',
        };

        const visitEvents = (hData || []).map(visit => ({
          id: visit.id,
          type: 'VISIT',
          date: visit.date, // Using your standard 'date' column
          time: visit.time, // Using your standard 'time' column
          title: visit.service,
          subtitle: 'Clinical Session',
          details: visit.notes 
        }));

        const combined = [registrationEvent, ...visitEvents].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTimelineEvents(combined);
      }
      setLoading(false);
    }
    getFullProfile();
  }, [patientId]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await supabase.from("patients").update({ notes: notes }).eq("id", patientId);
    setSavingNotes(false);
  };

  const handleAddNextVisit = async () => {
    if (!nextVisitDate) return;

    // This creates a NEW row in the appointments table for the follow-up
    const { error } = await supabase.from("appointments").insert([{ 
      name: patient.name, 
      phone: patient.phone,
      date: nextVisitDate,
      time: nextVisitTime, // Added the specific time here
      service: nextService,
      notes: nextServiceNotes,
      status: 'confirmed' // Auto-confirm so it appears in timeline immediately
    }]);

    if (!error) {
      window.location.reload(); 
    } else {
      alert("Error adding visit: " + error.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600 uppercase tracking-widest">Loading Clinical Records...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      <Link href="/admin/patients" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black transition-all w-fit uppercase text-[10px] tracking-[0.2em]">
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PROFILE SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 uppercase shadow-lg shadow-blue-100">
              {patient.name[0]}
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">{patient.name}</h1>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1 italic">
              Verified Patient
            </p>
            
            <div className="mt-8 space-y-4 pt-8 border-t border-slate-50 text-left">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <MapPin size={14} className="text-blue-500" /> {patient.address}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <Calendar size={14} className="text-blue-500" /> Registration Date {patient.registration_date}
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 space-y-4">
            <h3 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Medical Profile</h3>
            <p className="text-xs font-bold text-slate-900 uppercase">History: <span className="font-medium normal-case text-slate-600">{patient.medical_history || "No significant medical history logged."}</span></p>
          </div>
        </div>

        {/* CLINICAL TIMELINE & NOTES */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white shadow-xl shadow-slate-200">
            <h3 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
              <ClipboardList size={14} /> Primary Chief Complaint
            </h3>
            <p className="text-2xl font-medium italic opacity-90 leading-tight">
              "{patient.chief_complaint || "General Consultation"}"
            </p>
          </div>

          <section className="bg-white border border-slate-200 rounded-[2.8rem] p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Clinical Master Summary
              </h3>
              <button 
                onClick={handleSaveNotes} 
                disabled={savingNotes} 
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                {savingNotes ? "Saving..." : "Update Notes"}
              </button>
            </div>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-slate-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700 placeholder:text-slate-300"
              placeholder="Record long-term treatment plans, allergies, or progress notes..."
            />
          </section>

          <div className="space-y-8 relative px-4 pt-4 pb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Clinical Journey</h2>
            <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-slate-100" />

            <div className="space-y-10">
              {/* FOLLOW-UP FORM */}
              <div className="relative flex items-start gap-8 group">
                <div className="z-10 w-12 h-12 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-all shadow-sm">
                  <Plus size={24} />
                </div>
                <div className="flex-1">
                  {!isAddingVisit ? (
                    <button 
                      onClick={() => setIsAddingVisit(true)} 
                      className="w-full text-left p-6 rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 transition-all"
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">+ Record New Visit / Procedure</span>
                    </button>
                  ) : (
                    <div className="bg-white p-8 rounded-[2.8rem] border-2 border-blue-600 shadow-2xl space-y-5 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Visit Date</label>
                          <input type="date" value={nextVisitDate} onChange={(e) => setNextVisitDate(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Visit Time</label>
                          <input type="time" value={nextVisitTime} onChange={(e) => setNextVisitTime(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Procedure / Service</label>
                        <select value={nextService} onChange={(e) => setNextService(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 appearance-none">
                          <option value="Consultation">Consultation</option>
                          <option value="Root Canal">Root Canal</option>
                          <option value="Scaling & Polishing">Scaling & Polishing</option>
                          <option value="Extraction">Extraction</option>
                          <option value="Dental Filling">Dental Filling</option>
                          <option value="X-Ray">X-Ray</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Clinical Procedure Notes</label>
                        <textarea 
                          value={nextServiceNotes} onChange={(e) => setNextServiceNotes(e.target.value)}
                          placeholder="Specific teeth numbers, materials used, or medicines prescribed..."
                          className="w-full p-4 h-28 bg-slate-50 rounded-xl text-sm border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleAddNextVisit} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Add to Timeline</button>
                        <button onClick={() => setIsAddingVisit(false)} className="px-6 bg-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TIMELINE EVENTS */}
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative flex items-start gap-8 group">
                  <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${event.type === 'REGISTRATION' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-50 text-blue-500'}`}>
                    {event.type === 'REGISTRATION' ? <Star size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div className="flex-1 bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={10} className="text-blue-500" /> {event.subtitle}
                        </p>
                      </div>
                      <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg w-full md:w-auto">
                        <p className="text-sm font-black text-slate-900">{event.date}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase">{event.time}</p>
                      </div>
                    </div>
                    {event.details && (
                      <div className="mt-5 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs text-slate-600 italic leading-relaxed">
                        {event.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}