'use client';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-[100vh] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
      }}
    >
      {/* 🔴 Overlay to darken image slightly for text clarity */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* ✍️ Text content container */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-2xl space-y-6 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Logistics <br /> Reinvented
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Real-time tracking, fast and reliable shipping
          </p>
          <button className="bg-[#FFD700] text-black px-6 py-3 mt-4 rounded-full font-semibold hover:brightness-110 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
