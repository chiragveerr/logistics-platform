'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Debounce submit to prevent double submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await safeFetch(
        `${BASE}/api/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
        { debounce: true }
      );

      if (res?.success) {
        toast.success('✅ Message sent successfully!');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('❌ Failed to send message: ' + (res?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 🌟 Hero Section with Background Image */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/contactHero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-200 text-lg">
            We&apos;re here to help you move the world.
          </p>
        </motion.div>
      </section>

      {/* 📝 Contact Form Section */}
      <section className="relative z-20 -mt-20 flex justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 rounded-xl shadow-lg max-w-2xl w-full"
        >
          <h2 className="text-2xl font-bold text-[#902f3c] mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
              />
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
              />
            </div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-[#902f3c] text-white font-semibold rounded-lg hover:bg-[#7e2632] transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* 🧹 Optional Footer Spacer */}
      <div className="py-10" />
    </div>
  );
}