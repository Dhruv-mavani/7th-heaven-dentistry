"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  IndianRupee, Search, ChevronRight, User, 
  ArrowUpRight, TrendingUp, AlertCircle, Download, Clock
} from "lucide-react";
import Link from "next/link";

export default function GlobalPayments() {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    async function getClinicFinances() {
      setLoading(true);
      const { data: patients } = await supabase.from("patients").select("id, name, phone");
      const { data: payments } = await supabase.from("payments").select("patient_id, amount_total, amount_paid, created_at").order("created_at", { ascending: false });

      if (patients) {
        const today = new Date().toLocaleDateString('en-CA'); // Gets YYYY-MM-DD in local time
        const todayTotal = payments?.filter(p => p.created_at.startsWith(today))
          .reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0;
        setTodayRevenue(todayTotal);

        const enrichedLedgers = patients.map(p => {
          const pPayments = payments?.filter(pay => pay.patient_id === p.id) || [];
          const sortedPayments = [...pPayments].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
          const totalBilled = pPayments.reduce((acc, curr) => acc + Number(curr.amount_total), 0);
          const totalPaid = pPayments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
          const balance = totalBilled - totalPaid;
          
          // Capture the latest transaction time for this patient
          const lastActivity = sortedPayments.length > 0 ? sortedPayments[0].created_at : null;

          let status = "No Dues";
          if (totalBilled > 0) {
            if (balance <= 0) status = "Paid";
            else if (totalPaid > 0) status = "Partial";
            else status = "Unpaid";
          }
          return { ...p, totalBilled, totalPaid, balance, status, lastActivity };
        });
        setLedgers(enrichedLedgers);
      }
      setLoading(false);
    }
    getClinicFinances();
  }, []);

  const exportGlobalCSV = () => {
  const headers = ["Patient Name", "Phone", "Total Billed", "Total Paid", "Outstanding Balance", "Status", "Date", "Time"];
  
  const rows = ledgers.map(l => {
    let dateStr = "N/A";
    let timeStr = "N/A";

    if (l.lastActivity) {
      const d = new Date(l.lastActivity);
      // Format: 24/02/2026
      dateStr = d.toLocaleDateString('en-IN'); 
      // Format: 02:30 PM (IST)
      timeStr = d.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    }

    return [
      `"${l.name}"`, // Quote names to prevent comma errors
      `"${l.phone || 'N/A'}"`, 
      l.totalBilled, 
      l.totalPaid, 
      l.balance, 
      l.status, 
      dateStr, 
      timeStr
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Clinic_Financial_Summary.csv`);
  document.body.appendChild(link);
  link.click();
};

  const filtered = ledgers.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-20 text-center font-black text-blue-600 animate-pulse uppercase tracking-[0.3em]">Syncing Clinical Ledger...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10 bg-slate-50/30 min-h-screen">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <TrendingUp className="absolute right-[-10px] top-[-10px] text-white/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform" />
          <div className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Total Collection
          </div>
          <h2 className="text-5xl font-serif font-bold">₹{todayRevenue.toLocaleString()}</h2>
          <button onClick={exportGlobalCSV} className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/10">
            <Download size={12} /> Export CSV
          </button>
        </div>
        
        {/* Total Remaining Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="text-rose-500 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertCircle size={14} /> Total Outstanding
          </div>
          <h2 className="text-4xl font-bold text-slate-900">
            ₹{ledgers.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Across {ledgers.length} Patients</p>
        </div>

        {/* Search Field */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ledger) => (
          <Link key={ledger.id} href={`/admin/payments/${ledger.id}`}>
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <User size={24} />
                </div>
                <StatusBadge status={ledger.status} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{ledger.name}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={10} /> 
                {ledger.lastActivity ? new Date(ledger.lastActivity).toLocaleDateString() : 'No Activity'}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Balance</p>
                  <p className={`text-2xl font-black ${ledger.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{ledger.balance.toLocaleString()}
                  </p>
                </div>
                <div className="text-right flex items-center gap-1 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                  History <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "Paid": "bg-emerald-100 text-emerald-700",
    "Partial": "bg-amber-100 text-amber-700",
    "Unpaid": "bg-rose-100 text-rose-700",
    "No Dues": "bg-slate-100 text-slate-400"
  };
  return (
    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
}