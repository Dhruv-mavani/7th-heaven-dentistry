import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <Navbar solid />

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-6">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
            Meet your dentist
          </p>

          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-black via-gray-400 to-blue-800 bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
            Trusted Dental Care in Surat
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            At 7th Heaven Family Dentistry, we combine modern technology with
            gentle, personalized care to help every patient smile confidently.
          </p>

          <div>
        <a
        href="/book"
        className="inline-block px-10 py-4 rounded-2xl bg-blue-600 border border-gray-200 text-white font-semibold text-lg shadow-sm hover:shadow-md hover:bg-blue-700 transition"
      >
        Book Appointment
      </a>
    </div>
        </div>
      </section>

      {/* ================= DOCTOR INFO ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-14 items-center">

          {/* Doctor Image */}
          <div className="flex justify-center">
            <img
              src="/images/doctor.png"
              alt="Dr. Kartik Patel"
              className="w-[415px] rounded-3xl shadow-2xl object-cover"
            />
          </div>

          {/* Doctor Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-500 to-blue-500 animate-gradient bg-clip-text text-transparent">
              Dr. Kartik Patel
            </h2>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
  <p className="uppercase tracking-widest text-xs font-semibold text-blue-600">
    Qualifications
  </p>

  <p className="mt-2 text-lg font-semibold text-gray-900">
    B.D.S., M.D.S.
  </p>

  <p className="text-gray-600 text-sm mt-1">
    Orthodontics & Dentofacial Orthopedics Specialist
  </p>
</div>

            <p className="text-gray-500 leading-relaxed text-lg">
        For over <b>15 years of Experience</b>, Dr. Kartik Patel has been dedicated to transforming the dental experience through advanced, personalized care. At 7th Heaven Family Dentistry, he has created a warm environment equipped with the latest technology to provide gentle and painless treatments. Dr. Patel’s expertise spans everything from routine family check-ups to complete smile correction, ensuring every patient receives the highest quality of care.
      </p>

            {/* Highlights */}
      <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-600">
        <p>✅ Orthodontic Specialist</p>
        <p>✅ Family-Friendly Care</p>
        <p>✅ Modern Treatment Plans</p>
        <p>✅ Trusted in Surat</p>
      </div>

            
            <Link
              href="/book"
              className="inline-block px-10 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
            >
              Book Your Appointment Now
            </Link>
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
