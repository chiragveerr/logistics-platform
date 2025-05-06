'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#fdf2f3] text-[#902f3c] pt-16 pb-10 px-6 sm:px-12 lg:px-24 mt-24 rounded-t-2xl shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left Logo / Brand */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold">LogistiX</h2>
          <p className="text-sm text-[#902f3c]/70">
            Connecting global freight with smarter solutions.
          </p>
        </div>

        {/* Middle Links */}
        <div className="flex gap-6 text-sm">
          <Link href="/services" className="hover:underline">
            Services
          </Link>
          <Link href="/locations" className="hover:underline">
            Locations
          </Link>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Right Socials */}
        <div className="flex gap-5 text-lg">
          <Link href="#" className="hover:text-[#a74455]">
            📷
          </Link>
          <Link href="#" className="hover:text-[#a74455]">
            🐦
          </Link>
          <Link href="#" className="hover:text-[#a74455]">
            💼
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs mt-10 text-[#902f3c]/70">
        © {new Date().getFullYear()} LogistiX. All rights reserved.
      </div>
    </footer>
  );
}
