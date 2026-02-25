"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Handle standard Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  // Handle Password Reset Request
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Recovery link sent to your email!");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Interactive Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]" />

      <AnimatePresence mode="wait">
        {!isForgotMode ? (
          // --- LOGIN CARD ---
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-[450px] p-12 rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6 rotate-3">
                <ShieldCheck size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Portal</h1>
              <p className="text-gray-500 mt-2 text-center">Smile Guru Clinic Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="dr.patel@clinic.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Sign In to Clinic"}
              </button>
            </form>
          </motion.div>
        ) : (
          // --- FORGOT PASSWORD CARD ---
          <motion.div
            key="forgot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-[450px] p-12 rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-white shadow-2xl"
          >
            <button 
              onClick={() => setIsForgotMode(false)}
              className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-8 font-bold text-sm"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Enter your registered email and we'll send a secure link to reset your clinic credentials.
            </p>

            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send Recovery Link"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}