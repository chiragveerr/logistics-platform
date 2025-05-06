'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    icon: '✈️',
    title: 'Air Freight',
    description: 'Fast international cargo delivery by air.',
  },
  {
    icon: '🚛',
    title: 'Over Dimensional Cargo',
    description: 'Special handling for large and heavy freight.',
  },
  {
    icon: '📦',
    title: 'Courier Shipment',
    description: 'Express door-to-door delivery for parcels.',
  },
  {
    icon: '🛃',
    title: 'Customs Clearance',
    description: 'Legal documentation for smooth import/export.',
  },
  {
    icon: '🧾',
    title: 'Buyers Console',
    description: 'We manage consolidated shipping for buyers.',
  },
  {
    icon: '🔐',
    title: 'Cargo Insurance',
    description: 'Protect your goods with full-value coverage.',
  },
  {
    icon: '🧠',
    title: 'Freight Nomination',
    description: 'We execute shipments through your partner carriers.',
  },
  {
    icon: '🏬',
    title: 'Warehousing & Racking',
    description: 'Storage, sorting, and custom racking solutions.',
  },
  {
    icon: '🚀',
    title: 'Project Cargo',
    description: 'Heavy-lift and large-scale shipping strategy.',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-32 px-6 sm:px-12 lg:px-24">
      <div className="container-xl max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-[#902f3c] mb-16"
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
          {services.map((service, index) => {
            const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#fdf2f3] p-6 rounded-xl border-l-4 border-[#902f3c] shadow hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#902f3c] mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
