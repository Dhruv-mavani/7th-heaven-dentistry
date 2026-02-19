"use client";

import Link from "next/link";

export default function Navbar({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`w-full z-50 ${
        solid
          ? "relative bg-gray-300 border-b border-gray-200"
          : "absolute top-0 left-0"
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto px-8 lg:px-16 py-6 flex items-center justify-between rounded-3xl mt-6 ${
          solid
            ? "bg-gray-300"
            : "bg-white/10 backdrop-blur-md border border-white/20"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="7th Heaven Dentistry Logo"
            className="w-10 h-10 object-contain scale-440"
          />
        </Link>

        {/* Nav Links */}
        <div
          className={`hidden md:flex gap-20 text-lg font-medium ${
            solid ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/services" className="hover:text-blue-400 transition">
            Services
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact Us
          </Link>
          <Link href="/reviews" className="hover:text-blue-400 transition">
            Reviews
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/book"
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </Link>
      </nav>
    </header>
  );
}
