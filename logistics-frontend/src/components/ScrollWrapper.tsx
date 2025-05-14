'use client';

import { ReactNode, useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export default function ScrollWrapper({ children }: { children: ReactNode }) {
  // Use the correct type for LocomotiveScroll instance
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize locomotive scroll
    const scrollInstance = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]') as HTMLElement,
      smooth: true,
      multiplier: 1.2,
      lerp: 0.1,
    });

    scrollRef.current = scrollInstance;

    // Update after fade-in
    const timer = setTimeout(() => {
      scrollInstance.update();
    }, 1000);

    return () => {
      clearTimeout(timer);

      // Clean destroy of locomotive scroll instance
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
    };
  }, []);

  return (
    <div
      data-scroll-container
      className="min-h-screen flex flex-col justify-between"
    >
      {children}
    </div>
  );
}
