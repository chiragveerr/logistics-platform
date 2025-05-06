'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    setShowNavbar(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#902f3c]/90 to-[#7e2632]/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* 🚀 LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/alpl-logo.png"
            alt="ALPL Logo"
            width={170}
            height={50}
            priority
            className="object-contain"
          />
        </Link>

        {/* 🔗 NAVIGATION */}
        {showNavbar && (
          <nav className="flex gap-6 items-center text-white font-semibold text-[15px] sm:text-base">
            <Link href="/" className="hover:text-white/80 transition">Home</Link>
            <Link href="/services" className="hover:text-white/80 transition">Services</Link>
            <Link href="/about" className="hover:text-white/80 transition">About Us</Link>

            {!isAuthenticated ? (
              <Link href="/login" className="hover:text-white/80 transition">Login</Link>
            ) : (
              <>
                <Link
                  href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className="hover:text-white/80 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-white/80 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
