"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] p-12 rounded-[3rem] bg-white shadow-2xl text-center"
      >
        {!success ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">New Password</h1>
            <p className="text-gray-500 mb-8">Set a strong password to secure your admin access.</p>
            
            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative text-left">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">New Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl 
           bg-gray-50 border border-transparent 
           text-gray-900 placeholder:text-gray-500
           focus:border-blue-500 focus:bg-white
           focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
            <p className="text-gray-500">Redirecting you to the login screen...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}