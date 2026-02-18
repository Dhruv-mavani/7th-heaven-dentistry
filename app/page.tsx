import {
  Smile,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/clinic.mp4" type="video/mp4" />
        </video>

        {/* Premium Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
          <div className="max-w-2xl space-y-8">

            {/* Small Tagline */}
            <p className="uppercase tracking-[0.35em] text-xs text-blue-200 font-semibold">
              Family Dentist in Surat
            </p>

            {/* Headline */}
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-white">
              7th Heaven Dentistry <br />
              <span className="text-blue-300 italic">
                Where Smiles Shine
              </span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/book"
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-xl hover:bg-blue-700 transition"
              >
                Book Appointment
              </a>

              <a
                href="https://wa.me/919825130447"
                target="_blank"
                className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition"
              >
                Message on WhatsApp
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex gap-6 pt-6 text-gray-200 text-sm">
              <span>⭐ 500+ Happy Patients</span>
              <span>🦷 Advanced Equipment</span>
              <span>😊 Family Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-serif font-bold text-gray-900">
              Premium Dental Care
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed">
              Experience modern dentistry with comfort, trust, and expert care.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

            <FeatureCard
              icon={<Smile size={28} />}
              title="Gentle Dentistry"
              desc="Comfort-focused treatments for a painless experience."
            />

            <FeatureCard
              icon={<ShieldCheck size={28} />}
              title="Trusted Clinic"
              desc="Hundreds of happy patients across Surat."
            />

            <FeatureCard
              icon={<Stethoscope size={28} />}
              title="Expert Care"
              desc="Professional team with advanced dental expertise."
            />

            <FeatureCard
              icon={<Sparkles size={28} />}
              title="Modern Equipment"
              desc="Latest technology for precise, safe results."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= FEATURE CARD COMPONENT ================= */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition bg-white hover:-translate-y-2">

      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-gray-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}
