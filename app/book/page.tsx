import AppointmentForm from "@/components/appointmentform";
import { ShieldCheck, Clock, MapPin } from "lucide-react";


export default function BookPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE (Video Branding Panel) */}
      <section className="relative hidden lg:flex flex-col justify-center px-16 py-20 text-white overflow-hidden">

        {/* 🎥 Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/clinicbooking.mp4" type="video/mp4" />
        </video>

        {/* ✅ Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Above Video */}
        <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">

  {/* Premium Tagline */}
  <p className="uppercase tracking-[0.4em] text-xs font-semibold text-blue-200">
    7th Heaven Family Dentistry • Surat
  </p>

  {/* Main Heading */}
  <h1 className="text-5xl font-serif font-bold leading-tight">
    Book Your Appointment
  </h1>

  {/* Subtitle */}
  <p className="text-lg text-gray-200 leading-relaxed">
    A seamless appointment experience with trusted dental professionals.
  </p>

  {/* Premium Info Cards with Icons */}
<div className="grid gap-4 pt-6 text-sm text-gray-100">

  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl">
    <ShieldCheck className="w-5 h-5 text-blue-200" />
    <span>Instant request submission & quick confirmation</span>
  </div>

  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl">
    <Clock className="w-5 h-5 text-blue-200" />
    <span>Modern equipment with gentle, painless care</span>
  </div>

  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl">
    <MapPin className="w-5 h-5 text-blue-200" />
    <span>Open Mon–Sat • 10AM–1PM & 4PM–8PM</span>
  </div>

</div>

</div>


      </section>

      {/* RIGHT SIDE (Appointment Form Panel) */}
      <section className="flex flex-col justify-center px-8 sm:px-16 py-20 bg-white">
        <AppointmentForm />
      </section>
    </main>
  );
}
