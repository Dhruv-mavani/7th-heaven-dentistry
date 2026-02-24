import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

const services = [
  {
    title: "Dental Fillings",
    desc: "Restore teeth with bio-compatible, mercury-free composite resins. Our advanced shade-matching ensures a durable, 'invisible' finish that mimics natural enamel translucency.",
    icon: "/images/dentalfilling.png",
  },
  {
    title: "Root Canal Treatment",
    desc: "Preserve your natural teeth through precise, pain-free endodontic therapy. We remove infection and seal the canal to restore function and prevent future complications.",
    icon: "/images/rootcanal.png",
  },
  {
    title: "Braces & Aligners",
    desc: "Achieve perfect dental alignment using modern orthodontic technology. From traditional braces to clear aligners, we design custom plans for a healthier, straighter smile.",
    icon: "/images/braces.png",
  },
  {
    title: "Dental Implants",
    desc: "The gold standard for missing teeth. Our surgical-grade titanium implants provide a permanent, root-like foundation for crowns that look and function like natural teeth.",
    icon: "/images/dentalimplant.png",
  },
  {
    title: "Teeth Whitening",
    desc: "Brighten your smile safely with professional-grade whitening. Our advanced clinical formulas remove deep stains and discoloration for an instantly radiant result.",
    icon: "/images/teethwhitening.png",
  },
  {
    title: "Pediatric Dentistry",
    desc: "Specialized, compassionate care designed for younger smiles. We focus on preventive treatments and positive experiences to build a lifetime of good oral health habits.",
    icon: "/images/pediatricdentistry.png",
  },
  {
    title: "Dentures",
    desc: "Custom-crafted prosthetic solutions to restore your smile and chewing ability. We offer high-precision partial and full dentures designed for comfort and a natural fit.",
    icon: "/images/dentures.png",
  },
  {
    title: "Cosmetic Dentistry",
    desc: "Enhance your smile's aesthetics with veneers, bonding, and contouring. We combine art and science to create the perfect smile you've always wanted to flaunt.",
    icon: "/images/cosmeticdentistry.png",
  },
  {
    title: "Cosmetic Surgery",
    desc: "Transformative facial and oral procedures designed to harmonize your features. Unlock your confidence with surgical expertise tailored to your unique anatomy.",
    icon: "/images/cosmeticsurgery.png",
  },
  {
    title: "Jaw Surgery",
    desc: "Correct structural irregularities to improve breathing, chewing, and facial symmetry. A specialized procedure focused on enhancing both health and appearance.",
    icon: "/images/jawsurgery.png",
  },
];
export default function ServicesPage() {
  return (
    <main>
      <Navbar solid/>

      {/* ================= HERO ================= */}
      <section className="pt-44 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-6">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
            Our Treatments
          </p>

          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-black via-gray-600 to-blue-400 animate-gradient bg-clip-text text-transparent">
            Our Dental Services
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            From routine checkups to advanced orthodontics, Dr. Kartik Patel
            provides complete dental care for every smile.
          </p>

          <Link
            href="/book"
            className="inline-block px-10 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition hover:-translate-y-2 bg-white"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-10 h-10 mx-auto flex items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-8 text-2xl font-semibold text-gray-900 text-center">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-500 leading-relaxed text-center text-sm">
                  {service.desc}
                </p>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <Link
                    href="/book"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto px-8 space-y-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900">
            Ready to Improve Your Smile?
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Schedule your visit today and experience premium dental care at
            7th Heaven Dentistry in Surat.
          </p>

          <Link
            href="/book"
            className="inline-block px-12 py-5 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    <Footer />
        
    </main>
  );
}
