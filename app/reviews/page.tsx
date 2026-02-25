import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const reviews = [
  {
    name: "Priya Shah",
    text: "The clinic is extremely clean and modern. Dr. Kartik Patel explained everything clearly and treatment was painless.",
  },
  {
    name: "Rahul Mehta",
    text: "Best dental experience in Surat. Friendly staff and excellent orthodontic care.",
  },
  {
    name: "Sneha Patel",
    text: "I was nervous at first, but the doctor made me feel comfortable. Amazing service!",
  },
  {
    name: "Aesha Patel",
    text: "Once during my social visit to surat in emergency I consult doctor for my tooth pain and his promt action helped me to relieve my tooth pain. Very good doctor.",
  },
  {
    name: "Nikil Patel",
    text: "Very good dentist doctor service in surat. I am fully satisfied by the treatment provided by doctor. I recommend smile guru clinic in vesu, Surat.",
  },
  {
    name: "Uma Kamejariya",
    text: "I visited clinic for braces for my sister. Overall very good experience. Ambience of clinic is very nice. Highly recommended for braces.",
  },
];

export default function ReviewsPage() {
  return (
    <main>
      <Navbar solid />

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-6">
          <p className="uppercase tracking-[0.3em] text-xs font-semibold text-blue-600">
            Patient Reviews
          </p>

          <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-black via-gray-400 to-blue-800 bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent">
            What Our Patients Say
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We are proud to be trusted by families across Surat. Here are some
            of our real patient experiences.
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

      {/* ================= REVIEWS GRID ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition hover:-translate-y-1"
            >
              <p className="text-yellow-500 text-lg">★★★★★</p>

              <p className="mt-4 text-gray-600 leading-relaxed text-sm">
                “{r.text}”
              </p>

              <p className="mt-6 font-semibold text-gray-900">
                ~ {r.name}
              </p>
            </div>
          ))}
        </div>

        {/* Google Reviews Button */}
        <div className="text-center mt-16">
      <a
        href="https://www.google.com/maps/place/Smile+Guru/@21.1458467,72.7849993,976m/data=!3m1!1e3!4m8!3m7!1s0x3be0533d348df059:0x2446751d1258df52!8m2!3d21.1458321!4d72.7878034!9m1!1b1!16s%2Fg%2F11s42q95qw?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        className="inline-block px-10 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-900 font-semibold text-lg shadow-sm hover:shadow-md hover:bg-gray-200 transition"
      >
        ⭐ View All Google Reviews
      </a>

      <a
        href="/book"
        className="inline-block px-10 py-4 ml-10 rounded-2xl bg-blue-600 border border-gray-200 text-white font-semibold text-lg shadow-sm hover:shadow-md hover:bg-blue-700 transition"
      >
        Book Appointment
      </a>
    </div>
    
      </section>

      <Footer />
    </main>
  );
}
