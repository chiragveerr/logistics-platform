'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#902f3c]/90 to-[#7e2632]/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center h-[64px] sm:h-[60px]">

        {/* 🔥 LOGO (Larger Size with tighter line height) */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/alpl-logo.png"
            alt="ALPL Logo"
            width={200} // ⬅️ increased width
            height={48}
            priority
            className="object-contain max-h-12 sm:max-h-[52px]"
          />
        </Link>

        {/* 🔗 NAVIGATION */}
        {show && (
          <nav className="hidden sm:flex gap-8 items-center text-white text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-yellow-300 transition ${
                  pathname === link.href ? 'text-yellow-400' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <Link href="/login" className="hover:text-yellow-300 transition">
                Login
              </Link>
            ) : (
              <>
                <Link
                  href={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className="hover:text-yellow-300 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-300 transition"
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
