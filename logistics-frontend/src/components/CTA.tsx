'use client';

import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="relative bg-[#902f3c] text-white py-24 sm:py-32 px-6 sm:px-12 lg:px-24 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#902f3c] via-[#a74455] to-[#902f3c] opacity-30 blur-3xl" />

      <div className="container-xl max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-6"
        >
          Ready to Ship Smarter?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg mb-10 text-white/90"
        >
          Request a personalized quote or talk to our logistics experts today.
        </motion.p>

        <motion.a
          href="/get-quote"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="inline-block px-8 py-4 bg-white text-[#902f3c] font-bold rounded-full hover:opacity-90 transition-all"
        >
          Get a Quote
        </motion.a>
      </div>
    </section>
  );
}
