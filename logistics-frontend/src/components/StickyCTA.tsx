'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StickyCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <Link
        href="/get-quote"
        className="bg-[#902f3c] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm hover:scale-105"
      >
        🚀 Get a Quote
      </Link>
    </motion.div>
  );
}
