'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ServiceType {
  _id: string;
  name: string;
  description: string;
  status: string;
}

// 🔥 Static visual services (Section 1)
const visualServices = [
  {
    title: 'Air Freight',
    description:
      'Designed for urgent cargo that can’t afford delays. Our air freight operations leverage major airlines, dedicated lanes, and strategic hubs to provide seamless global coverage with rapid transit. Perfect for textiles, electronics, perishables, and high-priority shipments.',
    image: '/air.jpg',
  },
  {
    title: 'Over Dimensional Cargo',
    description:
      'We engineer logistics solutions for extra-large freight — from turbines to excavators. Our specialists manage route surveys, escort permits, flatbed deployment, and customs documentation to move your heavy cargo with zero compromise.',
    image: '/oversized.jpg',
  },
  {
    title: 'Customs Clearance',
    description:
      'Fast-track customs clearance with full regulatory compliance. We classify goods, handle HS codes, duty optimization, and direct filing with ports and border officials — eliminating unnecessary hold-ups and clearance risks.',
    image: '/customs.jpg',
  },
  {
    title: 'Project Cargo',
    description:
      'From infrastructure modules to factory relocation — our project cargo division handles it all. We plan end-to-end movement with site feasibility, lifting equipment, convoy permissions, route simulations, and delivery finalization.',
    image: '/project.jpg',
  },
];

export default function ServicesPage() {
  const [activeServices, setActiveServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE}/api/services`, { cache: 'no-store', credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data.services)) {
          const active = data.services.filter((s: ServiceType) => s.status === 'active');
          setActiveServices(active);
        } else {
          toast.error('Their is no active services');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [BASE]);

  return (
    <main className="bg-white text-[#902f3c] font-sans">
      {/* 🌟 Section 1: Static Visual Cinematic Services */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 space-y-32">
        <h1 className="text-5xl font-extrabold text-center mb-20 tracking-tight">Our Logistics Services</h1>

        {visualServices.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              className={`flex flex-col lg:flex-row ${
                !isEven ? 'lg:flex-row-reverse' : ''
              } items-center gap-12`}
            >
              {/* Image Block */}
              <div className="w-full lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-[6px] border-[#902f3c]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto hover:scale-105 transition duration-300"
                  />
                </div>
              </div>

              {/* Text Block */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{service.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* 🚚 Section 2: Dynamic Backend Active Services */}
      <section className="bg-[#fdf2f3] py-24 px-6 sm:px-12 lg:px-24">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">
          Currently Active Services
        </h2>

        {loading ? (
          <div className="text-center py-20">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 max-w-6xl mx-auto">
            {activeServices.length > 0 ? (
              activeServices.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border-l-4 border-[#902f3c] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center col-span-full">
                No active services found.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
