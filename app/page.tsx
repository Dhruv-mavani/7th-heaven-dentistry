"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import {
  Smile,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export default function Home() {

  const homeServices = [
  {
    title: "Dental Fillings",
    desc: "Repairing the decay with fillings that blend in.",
    icon: "/images/dentalfilling.png",
  },
  {
    title: "Orthodontic Treatment/Braces",
    desc: "Never be too shy to smile.",
    icon: "/images/braces.png",
  },
  {
    title: "Root Canal Treatment",
    desc: "Let's save the tooth.",
    icon: "/images/rootcanal.png",
  },
  {
    title: "Teeth Whitening",
    desc: "Are you eyeing whiter teeth?",
    icon: "/images/teethwhitening.png",
  },
  {
    title: "Dental Implants",
    desc: "Make your implants last a lifetime.",
    icon: "/images/dentalimplant.png",
  },
  {
    title: "Pediatric Dentistry",
    desc: "For your child's dental health.",
    icon: "/images/pediatricdentistry.png",
  },
];

  return (

    

    <main className="overflow-x-hidden">

      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Navbar />
        
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/clinic.mp4" type="video/mp4" />
        </video>

        {/* Premium Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
          <div className="max-w-2xl space-y-8">


            {/* Headline */}
            <h1 className="font-serif text-center mt-50 text-6xl max-md:text-4xl max-sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-blue-400 bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
              Welcome to Smile Guru <br />
              <span className="text-blue-300 italic bg-gradient-to-r from-blue-400 via-gray-300 to-white bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
                Where Smiles Shine
              </span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex justify-center text-center flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/book"
                className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition"
              >
                Book Appointment
              </a>

              <a
                href="https://wa.me/919825130447"
                target="_blank"
                className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-white rounded-2xl bg-white/10 backdrop-blur-md text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition"
              >
                Message on WhatsApp
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-6 pt-6 text-gray-200 text-sm max-sm:flex-col max-sm:items-center">
              <span>⭐ 100+ Happy Patients</span>
              <span>🦷 Advanced Equipment</span>
              <span>😊 Family Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 max-sm:px-4">

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-600 to-blue-300 animate-gradient bg-clip-text text-transparent">
              Premium Dental Care
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed">
              Experience modern dentistry with comfort, trust, and expert care.
            </p>
          </div>

          {/* Cards Carousel */}
{/* Feature Carousel */}
<div className="mt-14">

  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={30}
    slidesPerView={1}
    navigation
    pagination={{ clickable: true }}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    className="max-w-xl mx-auto"
  >
    <SwiperSlide>
      <FeatureCard
        icon={<Smile size={32} />}
        title="Gentle Dentistry"
        desc="Comfort-focused treatments for a painless experience."
      />
    </SwiperSlide>

    <SwiperSlide>
      <FeatureCard
        icon={<ShieldCheck size={32} />}
        title="Trusted Clinic"
        desc="There are Hundreds of happy patients across Surat."
      />
    </SwiperSlide>

    <SwiperSlide>
      <FeatureCard
        icon={<Stethoscope size={32} />}
        title="Expert Care"
        desc="Professional team with advanced dental expertise."
      />
    </SwiperSlide>

    <SwiperSlide>
      <FeatureCard
        icon={<Sparkles size={32} />}
        title="Modern Equipment"
        desc="We use Latest technology for precise and safe results."
      />
    </SwiperSlide>
  </Swiper>
</div>

        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-8 max-sm:px-4">

    {/* Heading */}
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        Our Services
      </p>

      <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-600 to-blue-300 animate-gradient bg-clip-text text-transparent">
        Dental Treatments
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        Comprehensive care for every smile ~ from routine cleanings to advanced
        restorative procedures.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
  {homeServices.map((service) => (
    <ServiceCard
      key={service.title}
      icon={
        <img
          src={service.icon}
          alt={service.title}
          className="w-10 h-10 object-contain"
        />
      }
      title={service.title}
      desc={service.desc}
    />
  ))}
</div>



    {/* CTA */}
    <div className="text-center mt-16 flex justify-center gap-6 max-sm:flex-col max-sm:items-center">
      <a
        href="/book"
        className="inline-block px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-white rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
      >
        Book an Appointment
      </a>
      <a
        href="/services"
        className="inline-block px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-black rounded-2xl bg-white text-black font-semibold text-lg border border-gray-200 hover:bg-gray-100 transition"
      >
        View More Services
      </a>
    </div>
  </div>
</section>

{/* ================= CLINIC SECTION ================= */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-14 max-md:gap-8 items-center">

    {/* Left - CLINIC Image */}
    <div className="flex justify-center">
      <div className="relative">
        {/* CLINIC Photo */}
        <img
          src="/images/aboutus2.png"
          alt="Clinic Image"
          className="w-[580px] max-md:w-full rounded-3xl shadow-2xl object-cover"
        />
      </div>
    </div>

    {/* Right - CLINIC Info */}
    <div className="space-y-6">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        About our clinic
      </p>

      <h2 className="text-4xl font-serif font-bold text-gray-900 bg-gradient-to-r from-black via-gray-400 to-blue-400 bg-clip-text animate-gradient text-transparent">
        Smile Guru Dentistry
      </h2>

      <p className="text-gray-500 leading-relaxed text-lg">
        Finding top-tier dental care is easy at Smile Guru Family Dentistry. We have paired a welcoming and accessible environment with the latest in modern dental care facilities to redefine your experience. By combining advanced technology with a compassionate approach, we ensure that every treatment is gentle and painless. With over <b>15 years of trusted experience</b>, Dr. Kartik Patel is dedicated to delivering personalized care for patients of all ages. Whether you need an expert smile correction or complete family dentistry, our team is here to help you achieve your healthiest smile.
      </p>

      {/* Clinic Highlights */}
<div className="grid grid-cols-2 gap-4 pt-4 text-sm text-gray-600">
  <p className="flex items-center gap-2">
    ✅ Advanced Dental Technology
  </p>
  <p className="flex items-center gap-2">
    ✅ Gentle & Painless Care
  </p>
  <p className="flex items-center gap-2">
    ✅ Family-Friendly Clinic
  </p>
  <p className="flex items-center gap-2">
    ✅ Trusted in Surat for 15+ Years
  </p>
</div>


      {/* CTA */}
      <div className="pt-6 flex justify-center">
        <a
          href="/book"
          className="inline-block px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>
      </div>
    </div>
  </div>
</section>

{/* ================= TESTIMONIALS SECTION ================= */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-8 max-sm:px-4">

    {/* Heading */}
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        Google Reviews
      </p>

      <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-500 to-blue-300 animate-gradient bg-clip-text text-transparent">
        Loved by Patients Across Surat
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        Real stories from our happy patients who trust Dr. Kartik Patel for
        their dental care.
      </p>
    </div>

    {/* Reviews Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

      <ReviewCard
        name="Aesha Patel"
        review="Once during my social visit to surat in emergency I consult doctor for my tooth pain and his promt action helped me to relieve my tooth pain. Very good doctor."
      />

      <ReviewCard
        name="Nikil Patel"
        review="Very good dentist doctor service in surat. I am fully satisfied by the treatment provided by doctor. I recommend smile guru clinic in vesu, Surat."
      />

      <ReviewCard
        name="Uma Kamejariya"
        review="I visited clinic for braces for my sister. Overall very good experience. Ambience of clinic is very nice. Highly recommended for braces."
      />

    </div>

    {/* Google Button */}
    <div className="text-center mt-16 flex justify-center gap-6 max-sm:flex-col max-sm:items-center">
      <a
        href="https://www.google.com/maps/place/Smile+Guru/@21.1458371,72.7852285,836m/data=!3m1!1e3!4m8!3m7!1s0x3be0533d348df059:0x2446751d1258df52!8m2!3d21.1458321!4d72.7878034!9m1!1b1!16s%2Fg%2F11s42q95qw?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        className="inline-block px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-white border border-gray-200 text-gray-900 font-semibold text-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition"
      >
        ⭐ View All Google Reviews
      </a>
    </div>
  </div>
</section>



{/* ================= LOCATION SECTION ================= */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-14 max-md:gap-8 items-center">

    {/* Left Info */}
    <div className="space-y-6">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        Visit Our Clinic
      </p>

      <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-500 to-blue-300 animate-gradient bg-clip-text text-transparent">
        Your destination for quality care
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        Enjoy modern dental care in a truly welcoming and easily accessible environment at Smile Guru Dentistry, Vesu.
      </p>

      {/* Address & Timings Box */}
<div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-md space-y-6">

  {/* Clinic Address */}
  <div className="space-y-2">
    <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
      📍 Clinic Address (Vesu Branch)
    </h3>

    <p className="text-gray-600 text-sm leading-relaxed">
      <span className="font-medium text-gray-800">
        Smile Guru Dentistry
      </span>
      <br />
      303/304 pramukh orbit 2,<br/> opposit L P savani academy, near Cellestial Dreams - 395007
    </p>
  </div>

  {/* Divider */}
  <div className="h-[1px] bg-gray-200" />

  {/* Timings */}
  <div className="space-y-2">
    <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
      🕒 Timings
    </h3>

    <div className="text-sm text-gray-600 space-y-1">
      <p>
        <span className="font-medium text-gray-800">
          Monday - Saturday
        </span>
      </p>

      <p>10:00 AM - 1:00 PM
        (Smile Guru, Vesu)
      </p>
      <p>4:00 PM - 8:00 PM
      (Smile Guru, Kamrej)
      </p>

      <p className="text-red-500 font-semibold pt-2">
        Closed on Sundays
      </p>
    </div>
  </div>
</div>


      {/* CTA */}
      <div className="flex gap-4 pt-4 max-sm:flex-col">
        <a
          href="/book"
          className="px-8 py-4 text-lg text-center
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>

        <a
          href="https://maps.app.goo.gl/kXbcQEe6z6vJ66PR7"
          target="_blank"
          className="px-8 py-4 text-lg text-center
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-100 transition"
        >
          Get Directions
        </a>
      </div>
    </div>

    {/* Right Map Embed */}
    <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3638.795310876229!2d72.78522847507519!3d21.145837083747487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0533d348df059%3A0x2446751d1258df52!2sSmile%20Guru!5e1!3m2!1sen!2sin!4v1771994351936!5m2!1sen!2sin"
        width="100%"
        height="420"
        loading="lazy"
        className="w-full"
      ></iframe>
    </div>
  </div>
</section>

{/* ================= LOCATION SECTION 2 ================= */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-14 max-md:gap-8 items-center">

    {/* Left Info */}
    <div className="space-y-6">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        
      </p>

      <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-500 to-blue-300 animate-gradient bg-clip-text text-transparent">
        Our Second Address
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        Comfortable dental care designed around you, where friendly atmosphere comes together at Smile Guru Dentistry, Kamrej.
      </p>

      {/* Address & Timings Box */}
<div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-md space-y-6">

  {/* Clinic Address */}
  <div className="space-y-2">
    <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
      📍 Clinic Address (Kamrej Branch)
    </h3>

    <p className="text-gray-600 text-sm leading-relaxed">
      <span className="font-medium text-gray-800">
        Smile Guru Dentistry
        (7th Heaven)
      </span>
      <br />
      Bhagvati Society, Kamrej <br />
      Gujarat - 394185
    </p>
  </div>

  {/* Divider */}
  <div className="h-[1px] bg-gray-200" />

  {/* Timings */}
  <div className="space-y-2">
    <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
      🕒 Timings
    </h3>

    <div className="text-sm text-gray-600 space-y-1">
      <p>
        <span className="font-medium text-gray-800">
          Monday - Saturday
        </span>
      </p>

      <p>10:00 AM - 1:00 PM
        (Smile Guru, Vesu)
      </p>
      <p>4:00 PM - 8:00 PM
      (Smile Guru, Kamrej)
      </p>

      <p className="text-red-500 font-semibold pt-2">
        Closed on Sundays
      </p>
    </div>
  </div>
</div>


      {/* CTA */}
      <div className="flex gap-4 pt-4 max-sm:flex-col">
        <a
          href="/book"
          className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-center rounded-2xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </a>

        <a
          href="https://maps.app.goo.gl/MHuGA966dopoeSa29"
          target="_blank"
          className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 text-center rounded-2xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-100 transition"
        >
          Get Directions
        </a>
      </div>
    </div>

    {/* Right Map Embed */}
    <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4836.263981110337!2d72.960175276159!3d21.272706279353514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04690c756fdc1%3A0x80c6b0af09a75d39!2s7th%20Heaven%20Family%20Dentistry!5e1!3m2!1sen!2sin!4v1771493808992!5m2!1sen!2sin"
        width="100%"
        height="420"
        loading="lazy"
        className="w-full"
      ></iframe>
    </div>
  </div>
</section>

{/* ================= FAQ SECTION ================= */}
<section className="py-24 bg-gray-50">
  <div className="max-w-6xl mx-auto px-8">

    {/* Heading */}
    <div className="text-center space-y-4">
      <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
        FAQs
      </p>

    <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-black via-gray-400 to-blue-600 animate-gradient bg-clip-text text-transparent">
  Answers to Your Common Concerns
</h2>

      <p className="text-gray-500 text-lg leading-relaxed">
        Everything you need to know before visiting Smile Guru Dentistry.
      </p>
    </div>

    {/* FAQ Grid */}
    <div className="mt-14 grid md:grid-cols-2 gap-6">

      <FAQItem
        question="Do I need an appointment before visiting?"
        answer="Yes, we recommend booking an appointment in advance to avoid waiting time and ensure the doctor is available."
      />

      <FAQItem
        question="Is Root Canal Treatment painful?"
        answer="Not at all. With modern anesthesia and advanced techniques, root canal treatments are comfortable and pain-free."
      />

      <FAQItem
        question="What are your clinic timings?"
        answer="We are open Monday to Saturday, from 10AM-1PM at Vesu Branch and 4PM-8PM at Kamrej Branch. The clinic remains closed on Sundays."
      />

      <FAQItem
        question="Do you provide dental care for children?"
        answer="Yes, we offer gentle pediatric dentistry services for children of all ages in a friendly environment."
      />

      <FAQItem
        question="How long does teeth whitening last?"
        answer="Teeth whitening results can last from several months up to a year depending on your diet and oral hygiene."
      />

      <FAQItem
        question="How can I contact the clinic quickly?"
        answer="You can directly message us on WhatsApp or book an appointment online through our website."
      />

    </div>

    {/* Contact Box */}
    <div className="mt-20 text-center bg-gray-50 border border-gray-200 rounded-3xl p-10 shadow-sm">
      <h3 className="text-2xl font-serif text-gray-900">
        <b>Still have questions?</b>
      </h3>

      <p className="mt-3 text-gray-600 leading-relaxed">
        Our team is happy to help you. Reach out anytime on WhatsApp or call us directly.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <a
          href="https://wa.me/919825130447"
          target="_blank"
          className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          Message on WhatsApp
        </a>

        <a
          href="/contact"
          className="px-8 py-4 text-lg 
           max-md:px-6 max-md:py-3 max-md:text-base
           max-sm:px-5 max-sm:py-2.5 max-sm:text-sm
           rounded-2xl bg-blue-600 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>

      <Footer />


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
    <div className="group p-12 max-sm:p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 text-center">

      {/* Icon */}
      <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
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

function ServiceCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition hover:-translate-y-1 text-center">

      {/* Icon Bubble */}
      <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-white transition">
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

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">

      {/* Full Clickable Header */}
      <summary className="cursor-pointer w-full flex justify-between items-center px-6 py-5 text-lg font-semibold text-gray-900 list-none select-none hover:bg-gray-50 transition">

        {question}

        <span className="text-blue-600 text-2xl font-light group-open:rotate-45 transition">
          +
        </span>
      </summary>

      {/* Answer */}
      <div className="px-6 pb-5">
        <p className="text-gray-600 leading-relaxed text-sm">
          {answer}
        </p>
      </div>
    </details>
  );
}

function ReviewCard({
  name,
  review,
}: {
  name: string;
  review: string;
}) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition hover:-translate-y-1">

      {/* Stars */}
      <p className="text-yellow-500 text-lg">★★★★★</p>

      {/* Review */}
      <p className="mt-4 text-gray-600 leading-relaxed text-sm">
        “{review}”
      </p>

      {/* Name */}
      <p className="mt-6 font-semibold text-gray-900">
        ~ {name}
      </p>
    </div>
  );
}