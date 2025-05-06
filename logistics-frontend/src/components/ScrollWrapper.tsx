'use client';

import { ReactNode, useEffect, useRef } from 'react';

export default function ScrollWrapper({ children }: { children: ReactNode }) {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    let scrollInstance: any;

    if (typeof window !== 'undefined') {
      import('locomotive-scroll').then((LocomotiveScroll) => {
        scrollInstance = new LocomotiveScroll.default({
          el: document.querySelector('[data-scroll-container]') as HTMLElement,
          smooth: true,
          multiplier: 1.2,
          lerp: 0.1,
        });

        scrollRef.current = scrollInstance;

        // ✅ Wait and then update after fade-in
        setTimeout(() => {
          scrollInstance.update();
        }, 1000);
      });
    }

    return () => {
      // ✅ Very important: clean destroy
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
