"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, Calendar, MapPin, Phone, AlertCircle, FileText, ClipboardList, 
  Plus, Stethoscope, User, X, CheckCircle2, Star, Clock, Trash2, Edit3, Save 
} from "lucide-react";
import Link from "next/link";


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
  const [nextVisitTime, setNextVisitTime] = useState("10:00"); 
  const [nextService, setNextService] = useState("Consultation");
  const [nextServiceNotes, setNextServiceNotes] = useState(""); 

  // Inline Editing State
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [nextAmount, setNextAmount] = useState("");

  useEffect(() => {
    async function getFullProfile() {
      setLoading(true);
      const { data: pData } = await supabase.from("patients").select("*").eq("id", patientId).single();

      if (pData) {
        setPatient(pData);
        setNotes(pData.notes || "");

        const { data: hData } = await supabase
          .from("appointments")
          .select("*")
          .eq("name", pData.name) 
          .order("date", { ascending: false });

        const registrationEvent = {
          id: 'reg-0',
          type: 'REGISTRATION',
          date: pData.registration_date,
          time: "Initial Entry", 
          title: 'Joined 7th Heaven',
          subtitle: 'Clinic Registration',
        };

        const visitEvents = (hData || []).map(visit => ({
          id: visit.id,
          type: 'VISIT',
          date: visit.date, 
          time: visit.time, 
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

  // Update handleAddNextVisit
const handleAddNextVisit = async () => {
  if (!nextVisitDate || !patient) return;
  const { error } = await supabase.from("appointments").insert([{ 
    name: patient.name, 
    phone: patient.phone,
    date: nextVisitDate,
    time: nextVisitTime,
    service: nextService,
    notes: nextServiceNotes,
    amount_due: parseFloat(nextAmount) || 0, // Store the fee
    payment_status: 'pending', 
    status: 'confirmed' 
  }]);
    if (!error) window.location.reload();
    else alert("Error: " + error.message);
  };

  const handleDeleteVisit = async (id: number) => {
    if (confirm("Permanently delete this clinical record?")) {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (!error) setTimelineEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  const startEditing = (event: any) => {
    setEditingEventId(event.id);
    setEditTitle(event.title);
    setEditDetails(event.details || "");
  };

  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from("appointments")
      .update({ service: editTitle, notes: editDetails })
      .eq("id", id);

    if (!error) {
      setTimelineEvents(prev => prev.map(e => e.id === id ? { ...e, title: editTitle, details: editDetails } : e));
      setEditingEventId(null);
    }
  };

  // LOADING GUARD: Prevents the page from crashing while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-blue-600 uppercase tracking-widest">
        Loading Clinical Records...
      </div>
    );
  }

  // DATA GUARD: If no patient found
  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-slate-400 uppercase tracking-widest">
        Patient Not Found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      <Link href="/admin/patients" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black transition-all w-fit uppercase text-[10px] tracking-[0.2em]">
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 uppercase shadow-lg shadow-blue-100">
              {patient?.name?.[0] || "?"}
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">{patient?.name || "Unknown Patient"}</h1>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1 italic">Verified Patient</p>
            <div className="mt-8 space-y-4 pt-8 border-t border-slate-50 text-left">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <MapPin size={14} className="text-blue-500" /> {patient?.address || "No Address"}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <Calendar size={14} className="text-blue-500" /> Member Since: {patient?.registration_date || "N/A"}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <Phone size={14} className="text-blue-500" /> {patient?.phone || "No Phone"}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase">
                <User size={14} className="text-blue-500" /> {patient?.age || "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 space-y-4">
            <h3 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Medical History</h3>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">{patient?.medical_history || "No significant medical history logged."}</p>
          </div>

          <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 space-y-4">
            <h3 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Stethoscope size={14} /> Allergies</h3>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">{patient?.allergies || "No allergies logged."}</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white shadow-xl shadow-slate-200">
            <h3 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><ClipboardList size={14} /> Chief Complaint</h3>
            <p className="text-2xl font-medium italic opacity-90 leading-tight">"{patient?.chief_complaint || "General Consultation"}"</p>
          </div>

          <section className="bg-white border border-slate-200 rounded-[2.8rem] p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><FileText size={16} /> Clinical Master Summary</h3>
              <button onClick={handleSaveNotes} disabled={savingNotes} className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">{savingNotes ? "Saving..." : "Update Notes"}</button>
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-32 bg-slate-50 border-none rounded-2xl p-5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100" placeholder="Record treatment plans..." />
          </section>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-serif font-bold text-slate-900">Clinical Journey</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                {timelineEvents.length} Entries
              </span>
            </div>

            <div className="relative bg-white border border-slate-200 rounded-[3rem] p-6 shadow-sm overflow-hidden">
              <div className="max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-10 relative pt-4 pb-12">
                  <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />

                  {/* ADD NEW VISIT */}
                  <div className="relative flex items-start gap-8 group">
                    <div className="z-10 w-12 h-12 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 text-slate-400 shadow-sm"><Plus size={24} /></div>
                    <div className="flex-1">
                      {!isAddingVisit ? (
                        <button onClick={() => setIsAddingVisit(true)} className="w-full text-left p-6 rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-white hover:bg-blue-50/50 transition-all"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+ Record New Visit / Procedure</span></button>
                      ) : (
                        <div className="bg-white p-8 rounded-[2.8rem] border-2 border-blue-600 shadow-xl space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                            <input type="date" value={nextVisitDate} onChange={(e) => setNextVisitDate(e.target.value)} className="p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100" />
                            <input type="time" value={nextVisitTime} onChange={(e) => setNextVisitTime(e.target.value)} className="p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100" />
                          </div>
                          <select value={nextService} onChange={(e) => setNextService(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold border-none ring-1 ring-slate-100">
                            <option value="Consultation">Consultation</option>
                            <option value="Root Canal">Root Canal</option>
                            <option value="Scaling & Polishing">Scaling & Polishing</option>
                            <option value="Extraction">Extraction</option>
                            <option value="Teeth Whitening">Teeth Whitening</option>
                          </select>
                          <textarea value={nextServiceNotes} onChange={(e) => setNextServiceNotes(e.target.value)} placeholder="Clinical details..." className="w-full p-4 h-28 bg-slate-50 rounded-xl text-sm border-none ring-1 ring-slate-100" />
                          <div className="flex gap-3">
                            <button onClick={handleAddNextVisit} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase">Add Visit</button>
                            <button onClick={() => setIsAddingVisit(false)} className="px-6 bg-slate-100 rounded-2xl text-slate-400"><X size={20} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TIMELINE LIST */}
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="relative flex items-start gap-8 group">
                      <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${event.type === 'REGISTRATION' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-50 text-blue-500'}`}>
                        {event.type === 'REGISTRATION' ? <Star size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div className="flex-1 bg-slate-50/50 p-7 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all relative group/card">
                        
                        {event.type === 'VISIT' && (
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-30">
                            {editingEventId === event.id ? (
                              <button onClick={() => saveEdit(event.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Save size={16} /></button>
                            ) : (
                              <button onClick={() => startEditing(event)} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit3 size={16} /></button>
                            )}
                            <button onClick={() => handleDeleteVisit(event.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16} /></button>
                          </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-between pr-12">
                          <div className="flex-1">
                            {editingEventId === event.id ? (
                              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full text-lg font-bold bg-white border-none ring-1 ring-blue-100 rounded-lg px-2 py-1 mb-1" />
                            ) : (
                              <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                            )}
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10} className="text-blue-500" /> {event.subtitle}</p>
                          </div>
                          <div className="text-left md:text-right mt-2 md:mt-0">
                            <p className="text-sm font-black text-slate-900">{event.date}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
    event.payment_status === 'paid' 
      ? 'bg-emerald-100 text-emerald-700' 
      : 'bg-rose-100 text-rose-700 animate-pulse'
  }`}>
    {event.payment_status || 'pending'}
  </span>
  <span className="text-[10px] font-bold text-slate-500">
    ₹{event.amount_due || 0}
  </span>
</div>

                        <div className="mt-4">
                          {editingEventId === event.id ? (
                            <textarea value={editDetails} onChange={(e) => setEditDetails(e.target.value)} className="w-full p-4 bg-white border-none ring-1 ring-blue-100 rounded-2xl text-xs text-slate-600 italic" />
                          ) : (
                            event.details && (
                              <p className="text-xs text-slate-600 italic leading-relaxed bg-white/50 p-4 rounded-2xl border border-slate-50">{event.details}</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}