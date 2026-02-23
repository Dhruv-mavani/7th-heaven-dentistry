"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, User, Phone, Stethoscope, Activity, Calendar, AlertCircle, Loader2, MapPin } from "lucide-react";

export default function PatientModal({ 
  onClose, 
  initialData 
}: { 
  onClose: () => void; 
  initialData?: any; 
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    chief_complaint: "",
    medical_history: "",
    allergies: "",
    address: "",
    registration_date: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        registration_date: initialData.registration_date ? initialData.registration_date.split('T')[0] : ""
      });
    } else {
      setFormData({
        name: "", phone: "", age: "", gender: "Male",
        chief_complaint: "", medical_history: "", allergies: "", address: "",
        registration_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { id, created_at, patient_number, ...updateData } = formData as any;

    if (initialData?.id) {
      const { error } = await supabase
        .from("patients")
        .update(updateData)
        .eq("id", initialData.id);
      if (error) alert(error.message);
      else onClose();
    } else {
      const { error } = await supabase.from("patients").insert([formData]);
      if (error) alert(error.message);
      else onClose();
    }
    
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-white flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* STICKY HEADER */}
        <div className="p-8 pb-4 flex justify-between items-start bg-white z-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              {initialData ? "Edit Patient" : "Clinical Intake"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {initialData ? "Update existing clinical record." : "Register a new patient to the practice."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
          <form id="patient-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <User size={12} /> Full Name
              </label>
              <input 
                required 
                value={formData.name}
                placeholder="Name" 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Phone size={12} /> Phone
              </label>
              <input 
                required
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile"
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, "")})}
                value={formData.phone}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Calendar size={12} /> Age
              </label>
              <input 
                type="number" 
                value={formData.age}
                placeholder="Years" 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select 
                value={formData.gender|| ""}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none appearance-none font-medium transition-all"
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <MapPin size={12} /> Home Address
              </label>
              <input 
                value={formData.address}
                placeholder="Street, Area, City..." 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, address: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Calendar size={12} /> Registration Date
              </label>
              <input 
                type="date"
                value={formData.registration_date}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, registration_date: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Activity size={12} /> Chief Complaint
              </label>
              <textarea 
                value={formData.chief_complaint}
                placeholder="Reason for visit" 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none h-20 resize-none font-medium transition-all"
                onChange={e => setFormData({...formData, chief_complaint: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> Medical History
              </label>
              <textarea 
                value={formData.medical_history}
                placeholder="Diabetes, BP, etc." 
                className="w-full p-4 rounded-2xl bg-red-50/30 border border-transparent focus:border-red-500 focus:bg-white outline-none h-28 resize-none font-medium text-red-700 transition-all"
                onChange={e => setFormData({...formData, medical_history: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Stethoscope size={12} /> Allergies
              </label>
              <textarea 
                value={formData.allergies}
                placeholder="Meds, food, etc." 
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none h-28 resize-none font-medium transition-all"
                onChange={e => setFormData({...formData, allergies: e.target.value})} 
              />
            </div>
          </form>
        </div>

        {/* STICKY FOOTER */}
        <div className="p-8 bg-white border-t border-gray-50 z-10">
          <button 
            form="patient-form"
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : initialData ? "Update Record" : "Save Clinical Record"}
          </button>
        </div>
      </div>
    </div>
  );
}