'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdDashboard, MdTrackChanges } from 'react-icons/md';
import { FaQuoteRight, FaEnvelopeOpenText, FaShippingFast, FaUserCircle } from 'react-icons/fa';

const sidebarLinks = [
  { name: 'Dashboard', href: '/user/dashboard', icon: <MdDashboard size={20} /> },
  { name: 'My Quotes', href: '/user/my-quotes', icon: <FaQuoteRight size={18} /> },
  { name: 'My Shipments', href: '/user/shipments', icon: <FaShippingFast size={18} /> },
  { name: 'Tracking', href: '/user/tracking', icon: <MdTrackChanges size={20} /> },
  { name: 'Support', href: '/user/support', icon: <FaEnvelopeOpenText size={18} /> },
  { name: 'Profile', href: '/user/profile', icon: <FaUserCircle size={18} /> },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setUserName(data.user.name);
      } catch (err) {
        console.error('❌ Failed to fetch user profile:', err);
        toast.error('Session expired. Please login again.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between py-6 px-4">
        <div>
          <div className="mb-8 px-2">
            <h1 className="text-xl font-bold text-white tracking-wider">
              🚛 Logistic<span className="text-yellow-400">Hub</span>
            </h1>
          </div>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-yellow-500 text-black font-semibold'
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="text-sm text-zinc-500 px-2 mt-6">
          <div className="flex items-center gap-2">
            <FaUserCircle size={18} />
            <span className="truncate">
              {userName ? `Welcome, ${userName}` : 'Loading...'}
            </span>
          </div>
          <p className="text-xs mt-1">Customer Dashboard</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
