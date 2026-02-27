"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`w-full z-50 ${
        solid
          ? "relative bg-gray-300 border-b border-gray-200"
          : "absolute top-0 left-0"
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 max-sm:px-4 py-3 flex items-center justify-between rounded-3xl mt-6 ${
          solid
            ? "bg-gray-300"
            : "bg-white/10 backdrop-blur-md border border-white/20"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 pr-8">
          <img
            src="/images/logo.png"
            alt="Smile Guru Logo"
            className="h-12 w-auto scale-[2.2] origin-left object-contain"
          />
        </Link>

        {/* Desktop Nav Links (UNCHANGED) */}
        <div
          className={`hidden lg:flex gap-12 xl:gap-20 text-base xl:text-lg font-medium ${
            solid ? "text-gray-700" : "text-gray-200"
          }`}
        >
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="https://sanginiadvancedwomenscare.myshopify.com" className="hover:text-blue-400 transition">
            Pregnancy
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

        {/* Desktop CTA (UNCHANGED) */}
        <Link
          href="/book"
          className="hidden lg:inline-block px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-base xl:text-lg shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`lg:hidden mx-4 mt-4 rounded-3xl p-6 space-y-6 ${
            solid
              ? "bg-gray-300 text-gray-700"
              : "bg-white/10 backdrop-blur-md border border-white/20 text-white"
          }`}
        >
          <Link href="/" onClick={() => setOpen(false)} className="block">
            Home
          </Link>
          <Link href="https://sanginiadvancedwomenscare.myshopify.com" onClick={() => setOpen(false)} className="block">
            Pregnancy
          </Link>
          <Link href="/services" onClick={() => setOpen(false)} className="block">
            Services
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">
            About Us
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block">
            Contact Us
          </Link>
          <Link href="/reviews" onClick={() => setOpen(false)} className="block">
            Reviews
          </Link>

          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="block text-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}