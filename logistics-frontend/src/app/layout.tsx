'use client';

import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import PageTransitionWrapper from '@/components/PageTransitionWrapper';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css'; // Make sure Tailwind and base CSS are loaded
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="relative bg-white text-[#902f3c] overflow-x-hidden min-h-screen flex flex-col">
        {/* 🛡️ AuthProvider wraps entire app */}
        <AuthProvider>

          {/* 🛡️ Navbar always fixed at top */}
          <Navbar />

          {/* 🚀 Sticky CTA button */}
          <StickyCTA />

          {/* 🎬 Page transition animation */}
          <PageTransitionWrapper>

            {/* ✨ Smooth scrolling handled by Lenis */}
            <LenisProvider>
              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </LenisProvider>

          </PageTransitionWrapper>

          {/* 🔥 Toasts for notifications */}
          <Toaster position="top-right" reverseOrder={false} />

        </AuthProvider>
      </body>
    </html>
  );
}
