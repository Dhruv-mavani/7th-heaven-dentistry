import Link from "next/link";

export default function Footer() {
  return (
<footer className="bg-gray-950 text-gray-300 pt-20 pb-10">
  <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12">

    {/* Brand */}
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img
          src="/images/logo.png"
          alt="Smile Guru Logo"
          className="w-12 h-11 object-contain scale-300"
        />
        <h3 className="text-white font-serif font-bold text-2xl">
          Smile Guru Dentistry
        </h3>
      </div>

      <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
        Premium dental care in Surat with modern treatments, gentle service, and
        trusted expertise by Dr. Kartik Patel.
      </p>

      <a
        href="/book"
        className="inline-block mt-4 px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Book Appointment
      </a>
    </div>

    {/* Quick Links */}
    <div className="space-y-4">
      <h4 className="text-white font-semibold text-lg">
        Quick Links
      </h4>

      <ul className="space-y-2 text-sm">
        <li>
          <a href="/" className="hover:text-white transition">
            Home
          </a>
        </li>
        <li>
          <a href="/services" className="hover:text-white transition">
            Services
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-white transition">
            About Clinic
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>
        </li>
        <li>
          <a href="/admin/login" className="hover:text-white transition">
            Doctor Login
          </a>
        </li>
      </ul>
    </div>

    {/* Contact Info */}
    <div className="space-y-4">
      <h4 className="text-white font-semibold text-lg">
        Visit Us
      </h4>

      <p className="text-sm text-gray-400 leading-relaxed">
        📍 Surat, Gujarat, India <br />
        🕒 Mon-Sat: 10AM-1PM (Vesu) & 4PM-8PM (Kamrej)<br />
        ❌ Closed Sundays
      </p>

      <a
        href="https://wa.me/919825130447"
        target="_blank"
        className="inline-block px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Message on WhatsApp
      </a>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-white/10 mt-16 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} Smile Guru Dentistry. All rights reserved.
  </div>
</footer>
  );
}