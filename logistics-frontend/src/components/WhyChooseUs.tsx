'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Points data
const points = [
  {
    icon: '🚀',
    title: 'Fast & Reliable',
    description: 'We deliver on time, every time — with guaranteed shipping SLAs.',
  },
  {
    icon: '🔐',
    title: 'Secure Shipments',
    description: 'All shipments are tracked, verified, and insured for your peace of mind.',
  },
  {
    icon: '🌍',
    title: 'Global Network',
    description: 'Our logistics hubs cover Asia, Europe, Americas, and the Middle East.',
  },
  {
    icon: '🧠',
    title: 'Smart Logistics',
    description: 'AI-powered route planning ensures efficient and eco-friendly transport.',
  },
];

export default function WhyChooseUs() {
  // Call useInView explicitly for each point (4 points)
  const inView0 = useInView({ triggerOnce: true, threshold: 0.2 });
  const inView1 = useInView({ triggerOnce: true, threshold: 0.2 });
  const inView2 = useInView({ triggerOnce: true, threshold: 0.2 });
  const inView3 = useInView({ triggerOnce: true, threshold: 0.2 });

  // Collect all refs & inView objects into array for mapping
  const refs = [inView0, inView1, inView2, inView3];

  return (
    <section id="why-choose-us" className="bg-white py-32 px-6 sm:px-12 lg:px-24">
      <div className="container-xl max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-[#902f3c] mb-16"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {points.map((point, index) => {
            const { ref, inView } = refs[index];
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#fdf2f3] p-8 rounded-2xl shadow-md border-l-4 border-[#902f3c] text-left"
              >
                <div className="text-3xl mb-4">{point.icon}</div>
                <h3 className="text-xl font-bold text-[#902f3c] mb-2">{point.title}</h3>
                <p className="text-gray-700">{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
