"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  User, Phone, Search, Loader2, Trash2, 
  Edit3, AlertTriangle, ExternalLink, Clock 
} from "lucide-react";
import Link from "next/link";
import PatientModal from "@/components/PatientModal"; 

type Patient = {
  id: string;
  patient_number: number;
  name: string;
  phone: string;
  age?: number;
  gender?: string;
  chief_complaint?: string;
  medical_history?: string;
  allergies?: string;
  preferred_time?: string; // Added for the Time Slot logic
  created_at: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPatients(data);
    }
    setLoading(false);
  }

  async function deletePatient(id: string) {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (!error) {
      setPatients(patients.filter(p => p.id !== id));
      setDeletingId(null);
    } else {
      alert("Error deleting patient: " + error.message);
    }
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Retrieving clinical records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 lg:px-0">
      <header className="bg-white/40 backdrop-blur-2xl border border-white/60 p-10 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Patient Directory</h1>
          <p className="text-gray-500 mt-2 text-lg">Dr. Kartik's central clinical database.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search name or phone..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/60 border border-white outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-20 bg-white/20 rounded-[2.5rem] border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg italic">No patients found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="relative bg-white/40 backdrop-blur-2xl border border-white/60 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between h-full">
              
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                      {patient.gender || 'GENERAL'}
                    </span>
                    {patient.preferred_time && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white/80 px-3 py-1 rounded-full border border-gray-100">
                        <Clock size={10} /> {patient.preferred_time}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 font-medium">
                  <Phone size={14} className="text-blue-400" /> {patient.phone}
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-white/60 rounded-[1.5rem] border border-white shadow-inner">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Concern</p>
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "{patient.chief_complaint || "Routine Checkup"}"
                    </p>
                  </div>
                  
                  {patient.medical_history && (
                    <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Alerts</p>
                      <p className="text-sm text-red-700 font-bold">{patient.medical_history}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="mt-8 pt-6 border-t border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">
                    DN-#{String(patient.patient_number).padStart(3, '0')}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingPatient(patient)}
                      className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeletingId(patient.id)}
                      className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* VIEW PROFILE CTA */}
                <Link 
                  href={`/admin/patients/${patient.id}`}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-blue-200"
                >
                  <ExternalLink size={14} />
                  View Clinical Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {editingPatient && (
        <PatientModal 
          initialData={editingPatient} 
          onClose={() => {
            setEditingPatient(null);
            fetchPatients(); // Refresh after edit
          }} 
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full shadow-2xl text-center border border-white">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Patient?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">This clinical record will be permanently removed from 7th Heaven database.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => deletePatient(deletingId)}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}