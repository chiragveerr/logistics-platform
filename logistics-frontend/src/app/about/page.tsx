"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 🌟 Hero Section with Background Image */}
      <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/aboutHero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            48+ Years of Excellence <br /> in Customs Clearance & Freight
            Forwarding
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Empowering Global Trade Since 1976.
          </p>

        </motion.div>
      </section>

      {/* 🕰️ Timeline + About Company Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-[#902f3c] mb-6">
            Company Timeline
          </h2>
          <ul className="border-l-4 border-[#902f3c] pl-6 space-y-8">
            {[
              ["1976", "Company Founded"],
              ["1985", "Freight Forwarding Expansion"],
              ["2000", "Global Import/Export Services"],
              ["2010", "Branch Expansion across India"],
              ["2020", "Awarded CHA Excellence"],
              ["2024", "48 Years Strong 🚀"],
            ].map(([year, desc], i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative"
              >
                <span className="absolute -left-6 top-1 w-4 h-4 bg-[#902f3c] rounded-full" />
                <p className="font-semibold text-[#902f3c]">{year}</p>
                <p className="text-gray-700">{desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-[#902f3c] mb-6">About Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Alauddin Logistics Private Limited, based in Mumbai, has been
            redefining customs clearance and freight forwarding for over four
            decades. We deliver end-to-end logistics solutions with precision,
            speed, and global coverage, backed by our commitment to customer
            success and operational excellence.
          </p>
        </motion.div>
      </section>

      {/* 🚚 Our Core Services */}
      <section className="px-6 py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#902f3c] mb-10">
          Our Core Services
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            "Customs Clearance",
            "Freight Forwarding",
            "Transportation",
            "Documentation",
            "Warehousing",
            "Project Cargo",
          ].map((service, i) => (
            <motion.div
              key={i}
              className="bg-white border p-6 rounded-xl text-center shadow hover:shadow-lg transition"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <p className="text-lg font-medium">{service}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌎 Branch Network */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#902f3c] mb-10">
          Our Branch Network
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Mumbai",
            "Bhadohi",
            "New Delhi",
            "Mundra",
            "Kandla",
            "Kanpur",
            "Moradabad",
          ].map((branch, i) => (
            <motion.div
              key={i}
              className="bg-white py-6 rounded-xl text-center text-[#902f3c] font-semibold border hover:bg-[#902f3c] hover:text-white transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {branch}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📦 Import/Export Expertise + Why Choose Us */}
      <section className="px-6 py-20 bg-gray-50 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-[#902f3c] mb-6">
            Import / Export Expertise
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Exports</h4>
              <ul className="text-gray-600 list-disc pl-5">
                <li>Hand-made Carpets</li>
                <li>Textiles & Garments</li>
                <li>Spices & Food</li>
                <li>Handicrafts</li>
                <li>Dyes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Imports</h4>
              <ul className="text-gray-600 list-disc pl-5">
                <li>Machinery</li>
                <li>Chemicals</li>
                <li>Electronics</li>
                <li>Consumer Goods</li>
                <li>Auto Parts</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-[#902f3c] mb-6">
            Why Choose Us
          </h2>
          <ul className="space-y-4">
            {[
              "48+ Years of Expertise",
              "Fastest Clearance",
              "CHA Certified",
              "Global Freight Solutions",
              "24x7 Support",
            ].map((point, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded-xl shadow text-gray-700"
              >
                ✔️ {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* 👤 Leadership Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#902f3c] mb-6">
          Meet Our Leadership
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <img
            src="/founder-placeholder.jpg"
            alt="Meraj Ansari"
            className="w-24 h-24 rounded-full object-cover border-2 border-[#902f3c]"
          />
          <h3 className="text-xl font-semibold">Meraj Ansari</h3>
          <p className="text-gray-500 text-sm">Founder & Managing Director</p>
        </motion.div>
      </section>

      {/* 📞 Contact Section */}
      <section className="px-6 py-20 bg-[#902f3c] text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="mb-2">📞 +91-2249241461 / +91-9920861461</p>
          <p className="mb-6">📧 meraj@alaudinlogistics.com</p>
          <Link href="/contact">
            <button className="px-6 py-3 bg-white text-[#902f3c] rounded-xl font-semibold hover:bg-gray-100 transition">
              Get in Touch
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
