import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

const services = [
  {
    title: "Dental Fillings",
    desc: "Repair cavities with natural-looking fillings that blend perfectly with your teeth.",
    icon: "/images/dentalfilling.png",
  },
  {
    title: "Root Canal Treatment",
    desc: "Save infected teeth with painless and advanced root canal procedures.",
    icon: "/images/rootcanal.png",
  },
  {
    title: "Braces & Aligners",
    desc: "Straighten your smile with modern orthodontic solutions.",
    icon: "/images/braces.png",
  },
  {
    title: "Dental Implants",
    desc: "Permanent replacement for missing teeth with long-lasting implants.",
    icon: "/images/dentalimplant.png",
  },
  {
    title: "Teeth Whitening",
    desc: "Brighten your smile with professional whitening treatments.",
    icon: "/images/teethwhitening.png",
  },
  {
    title: "Pediatric Dentistry",
    desc: "Gentle and friendly dental care for children of all ages.",
    icon: "/images/pediatricdentistry.png",
  },
  {
    title: "Dentures",
    desc: "Keep the right type of denture for you.",
    icon: "/images/dentures.png",
  },
  {
    title: "Cosmetic Dentistry",
    desc: "Time to flaunt that smile.",
    icon: "/images/cosmeticdentistry.png",
  },
  {
    title: "Cosmetic Surgery",
    desc: "Discover the transformative potential of cosmetic surgery and unlock the true you, both inside and out.",
    icon: "/images/cosmeticsurgery.png",
  },
  {
    title: "Jaw Surgery",
    desc: "Learn how this specialized surgical procedure can enhance your health, appearance, and overall well-being.",
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
