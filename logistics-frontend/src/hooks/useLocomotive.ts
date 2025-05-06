'use client';

import { useEffect } from 'react';

export default function useLocomotiveScroll() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('locomotive-scroll').then((LocomotiveScroll) => {
        const scroll = new LocomotiveScroll.default({
          el: document.querySelector('[data-scroll-container]') as HTMLElement,
          smooth: true,
          multiplier: 1.2,
          lerp: 0.1,
        });

        return () => {
          scroll.destroy();
        };
      });
    }
  }, []);
}
