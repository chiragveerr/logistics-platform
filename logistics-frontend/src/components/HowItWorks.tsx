'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    title: 'Request a Quote',
    description: 'Submit your shipping details and get instant pricing from our expert team.',
  },
  {
    title: 'Pickup Scheduled',
    description: 'We coordinate a pickup at your location at the scheduled date and time.',
  },
  {
    title: 'Customs Clearance',
    description: 'We handle all documentation and legal processes for export and import.',
  },
  {
    title: 'Global Shipping',
    description: 'Your cargo is shipped via air or sea with real-time tracking updates.',
  },
  {
    title: 'Delivered & Confirmed',
    description: 'Delivery is confirmed and the shipment is finalized with a digital signature.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // 👇 Move useInView calls out of map:
  const inViewRefs = steps.map(() => useInView({ triggerOnce: true, threshold: 0.2 }));

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-white pt-24 pb-48 px-6 sm:px-12 lg:px-24"
    >
      {/* 🔴 Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-[#902f3c] z-[60]"
        style={{ width: progressWidth }}
      />

      <div className="container-xl max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-[#902f3c] mb-20 text-center"
        >
          How It Works
        </motion.h2>

        <div className="relative border-l-4 border-[#902f3c] pl-16 space-y-48">
          {steps.map((step, index) => {
            const { ref, inView } = inViewRefs[index];
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 80 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-8 top-0 w-8 h-8 bg-[#902f3c] text-white rounded-full flex items-center justify-center font-bold shadow-md">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold text-[#902f3c]">{step.title}</h3>
                <p className="text-gray-700 mt-2 max-w-2xl">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
