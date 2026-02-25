"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, Calendar, MapPin, Phone, AlertCircle, FileText, ClipboardList, 
  Plus, Stethoscope, User, X, CheckCircle2, Star, Clock, Trash2, Edit3, Save, 
  Activity, Pill, Printer, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

// Dental Chart Constants
const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
const upperLeft  = [21, 22, 23, 24, 25, 26, 27, 28];
const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
const lowerLeft  = [31, 32, 33, 34, 35, 36, 37, 38];

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;
  
  //medication dropdown edit/save state
  const [editingRxId, setEditingRxId] = useState<string | null>(null);
  const [customToothTag, setCustomToothTag] = useState("");

  const [patient, setPatient] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notes, setNotes] = useState(""); 

  // New Prescription & History States
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: "", dosage: "", frequency: "1-0-1", duration: "" }]);
  const [advice, setAdvice] = useState("");
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);
  const [pastPrescriptions, setPastPrescriptions] = useState<any[]>([]);
  const [showPastMeds, setShowPastMeds] = useState(false);

  // Dental Chart State
  const [teethData, setTeethData] = useState<Record<number, string>>({});
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

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

  const getFullProfile = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from("patients").select("*").eq("id", patientId).single();

    if (pData) {
      setPatient(pData);
      setNotes(pData.notes || "");

      const { data: cData } = await supabase.from("dental_charts").select("*").eq("patient_id", patientId);
      const chartMap: Record<number, string> = {};
      cData?.forEach(item => { chartMap[item.tooth_number] = item.condition; });
      setTeethData(chartMap);

      // Fetch Visits
      const { data: hData } = await supabase.from("appointments").select("*").eq("name", pData.name).order("date", { ascending: false });
      
      // Fetch Medication History
      const { data: rxData } = await supabase.from("prescriptions").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
      setPastPrescriptions(rxData || []);

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
  };

  useEffect(() => {
    getFullProfile();
  }, [patientId]);

  const handlePrintAndSave = async () => {
    const validMeds = medicines.filter(m => m.name.trim() !== "");
    if (validMeds.length === 0) return alert("Add at least one medicine.");
    setIsSavingPrescription(true);

    const { error } = await supabase.from("prescriptions").insert([{ 
      patient_id: patientId, 
      medicines: validMeds, 
      advice: advice 
    }]);

    if (!error) {
      setIsSavingPrescription(false);
      setTimeout(() => { 
        window.print(); 
        getFullProfile();
        setMedicines([{ name: "", dosage: "", frequency: "1-0-1", duration: "" }]);
        setAdvice("");
      }, 200);
    } else {
      alert("Error saving: " + error.message);
      setIsSavingPrescription(false);
    }
  };

  const updateTooth = async (tooth: number, condition: string) => {
  if (!condition.trim()) return; // Don't save empty tags
  
  const newStatus = condition === 'clear' ? null : condition;
  setTeethData(prev => ({ ...prev, [tooth]: condition }));
  setSelectedTooth(null);
  setCustomToothTag(""); // Reset the input for next time

  await supabase.from("dental_charts").upsert({ 
    patient_id: patientId, 
    tooth_number: tooth, 
    condition: newStatus,
    updated_at: new Date()
  }, { onConflict: 'patient_id,tooth_number' });
};

  const Tooth = ({ num }: { num: number }) => {
  const status = teethData[num];
  const isCustom = status && !['cavity', 'filled', 'missing', 'crown'].includes(status);

  return (
    <div 
      onClick={() => setSelectedTooth(num)}
      className={`w-8 h-10 md:w-10 md:h-12 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 font-bold text-[10px] shadow-sm relative overflow-hidden ${
        status === 'cavity' ? 'bg-rose-500 text-white border-rose-600' : 
        status === 'filled' ? 'bg-blue-500 text-white border-blue-600' : 
        status === 'missing' ? 'bg-slate-200 text-slate-400 border-slate-300' : 
        status === 'crown' ? 'bg-amber-400 text-amber-900 border-amber-500' : 
        isCustom ? 'bg-purple-500 text-white border-purple-600' : // Custom tags turn purple
        'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
      }`}
    >
      <span>{num}</span>
      {isCustom && (
        <span className="absolute bottom-0 inset-x-0 bg-black/20 text-[6px] leading-none py-0.5 truncate px-0.5">
          {status}
        </span>
      )}
    </div>
  );
};

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await supabase.from("patients").update({ notes: notes }).eq("id", patientId);
    setSavingNotes(false);
  };

  const handleAddNextVisit = async () => {
    if (!nextVisitDate || !patient) return;
    const { error } = await supabase.from("appointments").insert([{ 
      name: patient.name, 
      phone: patient.phone,
      date: nextVisitDate,
      time: nextVisitTime,
      service: nextService,
      notes: nextServiceNotes,
      amount_due: parseFloat(nextAmount) || 0,
      payment_status: 'pending', 
      status: 'confirmed' 
    }]);
    if (!error) getFullProfile();
    setIsAddingVisit(false);
  };

  const handleDeleteVisit = async (id: number) => {
    if (confirm("Permanently delete this clinical record?")) {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (!error) setTimelineEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  const handleDeleteRx = async (id: any) => {
  if (!id) return;
  if (confirm("Delete this prescription record permanently?")) {
    const { error } = await supabase
      .from("prescriptions")
      .delete()
      .eq("id", id);

    if (!error) {
      // Refresh the sidebar list
      setPastPrescriptions(prev => prev.filter(rx => rx.id !== id));
    } else {
      alert("Error deleting: " + error.message);
    }
  }
};

  const startEditing = (event: any) => {
    setEditingEventId(event.id);
    setEditTitle(event.title);
    setEditDetails(event.details || "");
  };

  const saveEdit = async (id: number) => {
    const { error } = await supabase.from("appointments").update({ service: editTitle, notes: editDetails }).eq("id", id);
    if (!error) {
      setTimelineEvents(prev => prev.map(e => e.id === id ? { ...e, title: editTitle, details: editDetails } : e));
      setEditingEventId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-blue-600 uppercase tracking-widest italic">Loading Clinical Records...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-8 bg-slate-50/50 min-h-screen relative">
      
      {/* 🏥 SMILE GURU OFFICIAL PRINT LAYOUT */}
      <div id="rx-print" className="hidden print:block p-12 bg-white text-black h-full relative overflow-hidden">
    
    {/* Background Watermark Logo */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0 grayscale">
        <img src="/images/logo.png" alt="watermark" className="w-[500px] h-[500px] object-contain" />
    </div>

    <div className="relative z-10">
        {/* Letterhead Header */}
        <div className="border-b-4 border-blue-600 pb-6 mb-10 flex justify-between items-start">
            <div className="flex gap-6 items-center">
                {/* Clinic Logo */}
                <div className="w-24 h-24 flex items-center justify-center">
                    <img src="/images/logo.png" alt="Smile Guru" className="w-24 h-24 object-contain" />
                </div>
                <div>
                    <h1 className="text-5xl font-black text-blue-600 tracking-tighter uppercase">Smile Guru</h1>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mb-2 text-nowrap">Dental Clinic</p>
                    <p className="text-xl font-bold text-slate-900">Dr. Kartik Patel, <span className="text-blue-600 italic">BDS, MDS (Orthodontics)</span></p>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Reg No: [PENDING]</p>
                </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-500 leading-relaxed max-w-[300px] uppercase">
                <p className="text-slate-900 mb-1">303/304 Pramukh Orbit 2, Opp. L P Savani Academy,</p>
                <p>Vesu Canal Rd, Near Cellestial Dreams,</p>
                <p>Surat, Gujarat - 395007</p>
                <p className="text-blue-600 mt-2 text-sm font-black tracking-widest">+91 72111 77727</p>
            </div>
        </div>

        {/* Patient Info Bar */}
        <div className="flex justify-between mb-12 text-lg font-bold border-y border-slate-200 py-6 bg-slate-50/50 px-4">
            <div className="flex gap-12">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] mb-1">Patient Name</span>
                  <span>{patient?.name}</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-12">
                  <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] mb-1">Age / Gender</span>
                  <span>{patient?.age}Y / {patient?.gender || '—'}</span>
                </div>
            </div>
            <div className="text-right flex flex-col">
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] mb-1">Date of Issue</span>
                <span>{new Date().toLocaleDateString('en-IN')}</span>
            </div>
        </div>

        {/* Prescription Body */}
        <div className="min-h-[550px]">
            <h2 className="text-6xl font-serif italic text-blue-600 mb-10 ml-4">Rx</h2>
            
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b-2 border-slate-900">
                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500">Medicine & Strength</th>
                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Frequency</th>
                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.filter(m => m.name !== "").map((med, i) => (
                        <tr key={i} className="border-b border-slate-100">
                            <td className="py-6">
                                <p className="text-2xl font-bold text-slate-900">{med.name}</p>
                                <p className="text-sm font-medium text-slate-400 italic">{med.dosage}</p>
                            </td>
                            <td className="py-6 text-center">
                                <span className="text-xl font-black bg-slate-100 px-6 py-2 rounded-xl">{med.frequency}</span>
                            </td>
                            <td className="py-6 text-right">
                                <p className="text-xl font-bold">{med.duration} Days</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {advice && (
                <div className="mt-12 p-8 bg-blue-50/20 rounded-[2.5rem] border-l-4 border-blue-600">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Advice & Instructions</p>
                    <p className="text-xl italic text-slate-700 leading-relaxed">"{advice}"</p>
                </div>
            )}
        </div>

        {/* Follow-up Note */}
        <div className="mt-8 border-t border-slate-100 pt-4 italic text-slate-400 text-sm">
            Please bring this prescription for your next visit.
        </div>

        {/* Footer Signature Area */}
        <div className="mt-24 flex justify-between items-end">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <p>Clinically generated prescription</p>
                <p>Contact clinic if symptoms persist</p>
            </div>
            <div className="text-center">
                <div className="w-56 h-[2px] bg-slate-900 mb-2"></div>
                <p className="text-lg font-black uppercase tracking-tighter text-slate-900">Dr. Kartik Patel</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">MDS (Orthodontics)</p>
            </div>
        </div>
    </div>
</div>


      {/* 📱 SCREEN UI */}
      <div className="print:hidden space-y-8">
        <Link href="/admin/patients" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black transition-all w-fit uppercase text-[10px] tracking-[0.2em]">
          <ChevronLeft size={16} /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 uppercase shadow-lg shadow-blue-100">
                {patient?.name?.[0]}
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">{patient?.name}</h1>
              <div className="mt-8 space-y-4 pt-8 border-t border-slate-50 text-left">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><MapPin size={14} className="text-blue-500" /> {patient?.address}</div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><Phone size={14} className="text-blue-500" /> {patient?.phone}</div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase"><User size={14} className="text-blue-500" /> {patient?.age} Years</div>
              </div>
            </div>

            <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 space-y-4">
              <h3 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Medical History</h3>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{patient?.medical_history || "No history logged."}</p>
            </div>

            <div className="bg-rose-50/50 rounded-[2.5rem] p-8 border border-rose-100 space-y-4">
              <h3 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Stethoscope size={14} /> Allergies</h3>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{patient?.allergies || "No allergies logged."}</p>
            </div>
            

            {/* 💊 MEDICATION HISTORY DROPDOWN */}
<div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100">
  <button 
    onClick={() => setShowPastMeds(!showPastMeds)}
    className="w-full flex items-center justify-between text-emerald-600 font-black text-[10px] uppercase tracking-widest"
  >
    <span className="flex items-center gap-2"><Pill size={14} /> Medication History</span>
    {showPastMeds ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
  </button>
  
  {showPastMeds && (
    <div className="mt-4 space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      {pastPrescriptions.length === 0 ? (
        <p className="text-[10px] text-slate-400 italic text-center py-4">No past prescriptions found.</p>
      ) : (
        pastPrescriptions.map((rx, i) => (
          <div key={rx.id || i} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm relative group/rx">
            
            {/* 🛠️ RX ACTION BUTTONS */}
    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover/rx:opacity-100 transition-opacity">
      <button 
        onClick={() => {
          // This "Edit" logic loads the data back into the main form
          setMedicines(rx.medicines);
          setAdvice(rx.advice || "");
          // Scroll to the Rx Pad so the doctor can see it's loaded
          document.getElementById('rx-pad-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                title="Load into Rx Pad to Edit"
              >
                <Edit3 size={12} />
              </button>
              <button 
                onClick={() => handleDeleteRx(rx.id)}
                className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
              >
                <Trash2 size={12} />
              </button>
            </div>

            <p className="text-[10px] font-black text-emerald-500 mb-2 border-b border-emerald-50 pb-1 pr-10">
              {new Date(rx.created_at).toLocaleDateString('en-IN')}
            </p>
            
            <div className="space-y-2">
              {rx.medicines.map((m: any, j: number) => (
                <div key={j} className="text-[11px] font-bold text-slate-800 uppercase leading-tight">
                  • {m.name} 
                  <span className="text-slate-400 text-[9px] block ml-3 italic">
                    {m.dosage} | {m.frequency} | {m.duration} Days
                  </span>
                </div>
              ))}
            </div>
            {rx.advice && (
              <p className="mt-2 text-[9px] text-slate-400 italic border-t border-slate-50 pt-1">
                Note: {rx.advice}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )}
</div>
</div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white shadow-xl">
              <h3 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><ClipboardList size={14} /> Chief Complaint</h3>
              <p className="text-2xl font-medium italic opacity-90 leading-tight">"{patient?.chief_complaint || "General Consultation"}"</p>
            </div>

            {/* 🖊️ NEW PRESCRIPTION GENERATOR */}
            <section id="rx-pad-section" className="bg-white border-2 border-blue-100 rounded-[3rem] p-8 shadow-xl shadow-blue-50/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Pill size={16} /> Prescription Pad</h3>
                <button 
                  onClick={handlePrintAndSave}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
                >
                  {isSavingPrescription ? "Saving..." : <><Printer size={16} /> Save & Print</>}
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3">
                    <input 
                      value={med.name} 
                      placeholder="Medicine" 
                      onChange={(e) => { const upd = [...medicines]; upd[idx].name = e.target.value; setMedicines(upd); }}
                      className="col-span-4 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100" 
                    />
                    <input 
                      value={med.dosage} 
                      placeholder="Dosage" 
                      onChange={(e) => { const upd = [...medicines]; upd[idx].dosage = e.target.value; setMedicines(upd); }}
                      className="col-span-2 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100" 
                    />
                    <select 
                      value={med.frequency} 
                      onChange={(e) => { const upd = [...medicines]; upd[idx].frequency = e.target.value; setMedicines(upd); }}
                      className="col-span-3 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 appearance-none"
                    >
                        <option value="1-0-1">1-0-1</option>
                        <option value="1-1-1">1-1-1</option>
                        <option value="1-0-0">1-0-0</option>
                        <option value="0-0-1">0-0-1</option>
                        <option value="SOS">SOS</option>
                    </select>
                    <input 
                      value={med.duration} 
                      placeholder="Days" 
                      onChange={(e) => { const upd = [...medicines]; upd[idx].duration = e.target.value; setMedicines(upd); }}
                      className="col-span-2 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100" 
                    />
                    <button onClick={() => setMedicines(medicines.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 flex items-center justify-center"><X size={18} /></button>
                  </div>
                ))}
                <button 
                  onClick={() => setMedicines([...medicines, { name: "", dosage: "", frequency: "1-0-1", duration: "" }])}
                  className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mt-4 hover:underline"
                >
                  <Plus size={14} /> Add Medicine
                </button>
              </div>

              <textarea 
                value={advice} 
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Special Instructions / Advice..." 
                className="w-full p-5 mt-6 bg-slate-50 rounded-3xl border-none text-sm italic font-medium focus:ring-2 focus:ring-blue-100" 
              />
            </section>

            {/* 🦷 FDI Visual Dental Chart */}
<section className="bg-white border border-slate-200 rounded-[3rem] p-6 md:p-10 shadow-sm w-full">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
    <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
      <Activity size={16} /> FDI Visual Dental Chart
    </h3>
    
    {/* RESTORED DOT COLOUR INDICATORS */}
    <div className="flex flex-wrap gap-4 items-center bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Decay</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Filled</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Crown</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Missing</span>
      </div>
    </div>
  </div>

  <div className="w-full flex flex-col gap-8">
    <div className="grid grid-cols-2 gap-6 md:gap-12 w-full">
      <div className="grid grid-cols-8 gap-1 md:gap-2 border-r-2 border-slate-100 pr-3 md:pr-6">
        {upperRight.map(n => <Tooth key={n} num={n}/>)}
      </div>
      <div className="grid grid-cols-8 gap-1 md:gap-2">
        {upperLeft.map(n => <Tooth key={n} num={n}/>)}
      </div>
    </div>

    <div className="w-full flex items-center gap-4">
      <div className="flex-1 h-px bg-slate-100"></div>
      <span className="shrink-0 text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Occlusal Plane</span>
      <div className="flex-1 h-px bg-slate-100"></div>
    </div>

    <div className="grid grid-cols-2 gap-6 md:gap-12 w-full">
      <div className="grid grid-cols-8 gap-1 md:gap-2 border-r-2 border-slate-100 pr-3 md:pr-6">
        {lowerRight.map(n => <Tooth key={n} num={n}/>)}
      </div>
      <div className="grid grid-cols-8 gap-1 md:gap-2">
        {lowerLeft.map(n => <Tooth key={n} num={n}/>)}
      </div>
    </div>
  </div>
</section>


            {/* CLINICAL MASTER SUMMARY */}
            <section className="bg-white border border-slate-200 rounded-[2.8rem] p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><FileText size={16} /> Clinical Master Summary</h3>
                <button onClick={handleSaveNotes} disabled={savingNotes} className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">{savingNotes ? "Saving..." : "Update Notes"}</button>
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-32 bg-slate-50 border-none rounded-2xl p-5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100" placeholder="Record treatment plans..." />
            </section>

            {/* JOURNEY / TIMELINE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Clinical Journey</h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{timelineEvents.length} Entries</span>
              </div>
              <div className="relative bg-white border border-slate-200 rounded-[3rem] p-6 shadow-sm overflow-hidden">
                <div className="max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="space-y-10 relative pt-4 pb-12">
                    <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />
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

                    {timelineEvents.map((event) => (
  <div key={event.id} className="relative flex items-start gap-8 group">
    <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${event.type === 'REGISTRATION' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-50 text-blue-500'}`}>
      {event.type === 'REGISTRATION' ? <Star size={20} /> : <CheckCircle2 size={20} />}
    </div>
    
    <div className="flex-1 bg-slate-50/50 p-7 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all relative group/card">
      
      {/* 🛠️ ACTION BUTTONS (Hover visible) */}
      {event.type === 'VISIT' && (
        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-30">
          {editingEventId === event.id ? (
            <button 
              onClick={() => saveEdit(event.id)} 
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 shadow-sm"
            >
              <Save size={16} />
            </button>
          ) : (
            <button 
              onClick={() => startEditing(event)} 
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 shadow-sm"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button 
            onClick={() => handleDeleteVisit(event.id)} 
            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* 📝 HEADER & TIME */}
      <div className="flex flex-col md:flex-row justify-between pr-12">
        <div className="flex-1">
          {editingEventId === event.id ? (
            <input 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              className="w-full text-lg font-bold bg-white border-none ring-1 ring-blue-100 rounded-lg px-2 py-1 mb-1 focus:ring-2 focus:ring-blue-400 outline-none" 
            />
          ) : (
            <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
          )}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={10} className="text-blue-500" /> {event.subtitle}
          </p>
        </div>
        <div className="text-left md:text-right mt-2 md:mt-0">
          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{event.date}</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{event.time}</p>
        </div>
      </div>

      {/* 📖 DESCRIPTION / NOTES */}
      <div className="mt-4">
        {editingEventId === event.id ? (
          <textarea 
            value={editDetails} 
            onChange={(e) => setEditDetails(e.target.value)} 
            className="w-full p-4 bg-white border-none ring-1 ring-blue-100 rounded-2xl text-xs text-slate-600 italic focus:ring-2 focus:ring-blue-400 outline-none" 
          />
        ) : (
          event.details && (
            <p className="text-xs text-slate-600 italic leading-relaxed bg-white/50 p-4 rounded-2xl border border-slate-50">
              {event.details}
            </p>
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
      </div>

      {/* TOOTH MODAL */}
{selectedTooth && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-xs border border-slate-100 animate-in fade-in zoom-in duration-200">
      <h4 className="font-serif text-2xl font-bold mb-6 text-center text-slate-900">Tooth #{selectedTooth}</h4>
      
      <div className="flex flex-col gap-2">
        {/* Presets */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button onClick={() => updateTooth(selectedTooth, 'cavity')} className="p-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[9px] uppercase hover:bg-rose-100 transition-colors text-center">Decay</button>
          <button onClick={() => updateTooth(selectedTooth, 'filled')} className="p-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] uppercase hover:bg-blue-100 transition-colors text-center">Filled</button>
          <button onClick={() => updateTooth(selectedTooth, 'crown')} className="p-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[9px] uppercase hover:bg-amber-100 transition-colors text-center">Crown</button>
          <button onClick={() => updateTooth(selectedTooth, 'missing')} className="p-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase hover:bg-slate-100 transition-colors text-center">Missing</button>
        </div>

        {/* 🖊️ CUSTOM TAG INPUT */}
        <div className="relative mt-2">
          <input 
            type="text"
            value={customToothTag}
            onChange={(e) => setCustomToothTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateTooth(selectedTooth, customToothTag)}
            placeholder="Custom (e.g. RCT, Implant)"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-blue-100 outline-none pr-12"
          />
          <button 
            onClick={() => updateTooth(selectedTooth, customToothTag)}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <button onClick={() => updateTooth(selectedTooth, 'clear')} className="p-3 mt-4 text-rose-400 font-bold text-[9px] uppercase hover:bg-rose-50 rounded-xl">Clear Status</button>
        <button onClick={() => { setSelectedTooth(null); setCustomToothTag(""); }} className="p-2 text-slate-300 text-[10px] font-black uppercase">Cancel</button>
      </div>
    </div>
  </div>
)}

      <style jsx global>{`
        @media print {
            body * { visibility: hidden !important; }
            #rx-print, #rx-print * { visibility: visible !important; }
            #rx-print { position: fixed !important; left: 0 !important; top: 0 !important; width: 100% !important; height: auto !important; }
            @page { size: A4; margin: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}