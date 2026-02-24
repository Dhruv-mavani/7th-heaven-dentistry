"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ChevronLeft, Plus, X, Edit3, Save, Trash2, Calendar, Clock, ArrowDown 
} from "lucide-react";
import Link from "next/link";

export default function IndividualLedger({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [patient, setPatient] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [serviceName, setServiceName] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [method, setMethod] = useState("UPI");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchLedger();
  }, [patientId]);

  async function fetchLedger() {
    setLoading(true);
    const { data: p } = await supabase.from("patients").select("name").eq("id", patientId).maybeSingle();
    // Latest first
    const { data: pay } = await supabase.from("payments").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
    
    setPatient(p);
    setPayments(pay || []);
    setLoading(false);
  }

  const openEditModal = (payment: any) => {
    setEditingId(payment.id);
    setServiceName(payment.notes || "");
    setTotal(payment.amount_total?.toString() ?? "0");
    setPaid(payment.amount_paid?.toString() ?? "0");
    setMethod(payment.method || "UPI");
    setTransactionDate(new Date(payment.created_at).toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const t = parseFloat(total) || 0;
    const p = parseFloat(paid) || 0;
    const status = (p >= t && t > 0) ? "paid" : p > 0 ? "partial" : "unpaid";

    // Combine selected date with CURRENT time to avoid the "midnight 5:30am" issue
    const now = new Date();
    const finalDateTime = new Date(transactionDate);
    finalDateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    const payload = {
      patient_id: patientId,
      amount_total: t,
      amount_paid: p,
      method,
      notes: serviceName || "Treatment Record",
      status,
      created_at: finalDateTime.toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingId) {
      await supabase.from("payments").update(payload).eq("id", editingId);
    } else {
      await supabase.from("payments").insert([payload]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    fetchLedger();
  };

  const stats = payments.reduce((acc, curr) => {
    acc.due += Number(curr.amount_total || 0);
    acc.paid += Number(curr.amount_paid || 0);
    return acc;
  }, { due: 0, paid: 0 });

  if (loading) return <div className="p-20 text-center font-black text-blue-600 animate-pulse uppercase tracking-[0.4em]">Syncing Local Time...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 bg-white min-h-screen">
      
      <Link href="/admin/payments" className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black transition-all w-fit uppercase text-[10px] tracking-[0.2em]">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100"><ChevronLeft size={14} /></div>
        Return to Directory
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div> Financial Timeline
          </div>
          <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-tight">{patient?.name}</h1>
        </div>
        <button onClick={() => { setEditingId(null); setServiceName(""); setTotal(""); setPaid(""); setIsModalOpen(true); }} className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-2xl shadow-slate-200">
          <Plus size={18} /> Add Installment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-slate-50 p-1 rounded-[3rem]">
        <div className="p-8 bg-white rounded-[2.5rem]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Grand Total Billed</p>
          <h2 className="text-3xl font-bold text-slate-900">₹{stats.due.toLocaleString()}</h2>
        </div>
        <div className="p-8 bg-white/50">
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Collected to Date</p>
          <h2 className="text-3xl font-bold text-emerald-600">₹{stats.paid.toLocaleString()}</h2>
        </div>
        <div className="p-8 bg-white rounded-[2.5rem] border-2 border-rose-100">
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Total Balance Due</p>
          <h2 className="text-3xl font-bold text-rose-600">₹{(stats.due - stats.paid).toLocaleString()}</h2>
        </div>
      </div>

      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-slate-100">
        
        {payments.map((p, index) => {
          const balance = Number(p.amount_total) - Number(p.amount_paid);
          return (
            <div key={p.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {index === 0 ? <ArrowDown size={14} className="animate-bounce" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={12} className="text-blue-500" />
                      <time className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        {new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </time>
                    </div>
                    {/* FIXED TIME DISPLAY FOR IST */}
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase">
                      <Clock size={10} /> Recorded at {new Date(p.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      {p.updated_at !== p.created_at && (
                        <span className="text-blue-500 ml-2">• Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(p)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => { if(confirm("Delete this entry?")) supabase.from("payments").delete().eq("id", p.id).then(() => fetchLedger()); }} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-6">{p.notes}</h4>

                <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Received ({p.method})</p>
                    <p className="text-xl font-black text-emerald-600">₹{p.amount_paid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Remaining</p>
                    <p className={`text-xl font-black ${balance > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                      ₹{balance}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900">{editingId ? "Edit Entry" : "New Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-rose-500"><X /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Transaction Date</label>
                <input type="date" value={transactionDate} className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none" onChange={(e) => setTransactionDate(e.target.value)} />
              </div>

              <input value={serviceName} placeholder="Service Description" className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setServiceName(e.target.value)} />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={total} placeholder="Total Bill" className="p-5 bg-slate-50 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setTotal(e.target.value)} />
                <input type="number" value={paid} placeholder="Amount Paid" className="p-5 bg-slate-50 rounded-2xl text-sm font-bold text-emerald-600 outline-none" onChange={(e) => setPaid(e.target.value)} />
              </div>

              <select value={method} className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-bold outline-none" onChange={(e) => setMethod(e.target.value)}>
                <option value="UPI">UPI / GPay</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <button onClick={handleSave} className="w-full bg-blue-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all">
              {editingId ? "Update Transaction" : "Post Transaction"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}