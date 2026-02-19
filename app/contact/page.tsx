import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <main>
      <Navbar solid />

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-6">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
            Contact Us
          </p>

          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-black via-gray-400 to-blue-800 bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
            Get in Touch with Our Clinic
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions or need assistance? We’re here to help you schedule
            your visit easily.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12">

          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Visit 7th Heaven Dentistry
            </h2>

            <p className="text-gray-600 leading-relaxed">
              📍 7th Heaven family dentistry, Bhagvati Society, Kamrej 394185<br />
              🕒 Mon-Sat: 10AM-1PM & 4PM-8PM <br />
              ❌ Closed Sundays
            </p>

            <p className="text-gray-600">
              📞 Phone: +91 72111 77727
            </p>

            <a
              href="https://wa.me/919825130447"
              target="_blank"
              className="inline-block px-8 py-4 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Message on WhatsApp
            </a>
          </div>

          {/* Map Embed */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4836.263981110337!2d72.960175276159!3d21.272706279353514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04690c756fdc1%3A0x80c6b0af09a75d39!2s7th%20Heaven%20Family%20Dentistry!5e1!3m2!1sen!2sin!4v1771507986082!5m2!1sen!2sin"
              width="100%"
              height="400"
              loading="lazy"
              className="w-full h-[400px]"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
