"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, MessageSquare, LogOut, User, Plus, Calendar } from "lucide-react";
import PatientModal from "@/components/PatientModal";
import { supabase } from "@/lib/supabase";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States for the red dots
  const [hasNewInquiry, setHasNewInquiry] = useState(false);
  const [hasNewAppointment, setHasNewAppointment] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      // Clear local storage alerts so the next person doesn't see them
      localStorage.removeItem("newInquiryAlert");
      localStorage.removeItem("newAppointmentAlert");
      
      // Redirect to login page
      router.push("/admin/login"); 
    }
  };

  useEffect(() => {
    // 1. Load saved alerts from memory
    if (localStorage.getItem("newInquiryAlert") === "true") setHasNewInquiry(true);
    if (localStorage.getItem("newAppointmentAlert") === "true") setHasNewAppointment(true);

    // 2. Setup Realtime Channel
    const channel = supabase
      .channel('sidebar-notifications')
      // Listener for Inquiries (contact_messages)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => {
        if (window.location.pathname !== '/admin/messages') {
          setHasNewInquiry(true);
          localStorage.setItem("newInquiryAlert", "true");
        }
      })
      // Listener for Appointments
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, () => {
        if (window.location.pathname !== '/admin/dashboard') {
          setHasNewAppointment(true);
          localStorage.setItem("newAppointmentAlert", "true");
        }
      })
      .subscribe();

    // 3. Auto-clear when navigating
    if (pathname === '/admin/messages') {
      setHasNewInquiry(false);
      localStorage.removeItem("newInquiryAlert");
    }
    if (pathname === '/admin/dashboard') {
      setHasNewAppointment(false);
      localStorage.removeItem("newAppointmentAlert");
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  return (
    <>
      <aside
  className={`
    fixed md:relative top-0 left-0 z-50
    h-screen md:h-[calc(100vh-48px)]
    w-72
    transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    m-0 md:m-6 md:mr-0
    rounded-none md:rounded-[2.5rem]
    bg-white/40 backdrop-blur-2xl border border-white/60 shadow-sm
    p-8 flex flex-col
  `}
>      
        {/* TOP SECTION: Branding */}
        <div className="flex-1">
          <div className="relative h-24 mb-10 p-4 bg-gradient-to-r from-blue-200 via-gray-300 to-blue-300 animate-gradient text-transparent rounded-[2rem] border border-blue-600/10 flex items-center">
            <div className="absolute -left-5 bg-transparent p-2 pt-4 rounded-2xl flex-shrink-0 z-20 transition-transform hover:scale-110">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={100}  
                height={100} 
                className="object-contain"
                style={{ height: 'auto' }}
              />
            </div>
            <div className="ml-16">
              <h2 className="text-xl font-serif font-bold text-gray-900 leading-tight">Smile Guru</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600/60">Dental Clinic</p>
            </div>
          </div>

          <nav className="space-y-2">
            {/* Dashboard Link with Red Dot */}
            <Link href="/admin/dashboard" className={`relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === '/admin/dashboard' ? "bg-white/60 shadow-sm text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600"
            }`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
              {hasNewAppointment && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white shadow-sm"></span>
                </span>
              )}
            </Link>

            {/* Inquiries Link with Red Dot */}
            <Link href="/admin/messages" className={`relative px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === '/admin/messages' ? "bg-white/60 shadow-sm text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600"
            }`}>
              <MessageSquare size={20} />
              <span>Inquiries</span>
              {hasNewInquiry && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white shadow-sm"></span>
                </span>
              )}
            </Link>

            <Link href="/admin/patients" className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === '/admin/patients' ? "bg-white/60 shadow-sm text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600"
            }`}>
              <User size={20} />
              Patients
            </Link>

            <Link href="/admin/calendar" className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === '/admin/calendar' ? "bg-white/60 shadow-sm text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600"
            }`}>
              <Calendar size={20} />
              Calendar
            </Link>

            <Link href="/admin/payments" className={`px-5 py-3 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === '/admin/payments' ? "bg-white/60 shadow-sm text-blue-700 font-bold" : "text-gray-500 hover:text-blue-600"
            }`}>
              <Calendar size={20} />
              Payments
            </Link>
          </nav>

          <div className="mt-8">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Patient
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/40">
          <button 
            onClick={handleLogout} // Link the function here
            className="w-full px-5 py-3 rounded-2xl flex items-center gap-3 text-red-500 hover:bg-red-50/50 transition-all font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {isModalOpen && <PatientModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}