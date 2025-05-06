'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdOutlineLocalShipping,
  MdOutlineSupportAgent,
  MdOutlineLocationOn,
  MdOutlineSettings,
} from 'react-icons/md';
import { FaQuoteRight, FaBoxes } from 'react-icons/fa';
import { RiServiceFill } from 'react-icons/ri';
import { GiCargoShip } from 'react-icons/gi';
import { TbBox } from 'react-icons/tb';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
  { name: 'Quotes', href: '/admin/quotes', icon: <FaQuoteRight size={18} /> },
  { name: 'Shipments', href: '/admin/shipments', icon: <MdOutlineLocalShipping size={20} /> },
  { name: 'Tracking', href: '/admin/tracking', icon: <FaBoxes size={18} /> },
  { name: 'Locations', href: '/admin/locations', icon: <MdOutlineLocationOn size={20} /> },
  { name: 'Services', href: '/admin/services', icon: <RiServiceFill size={18} /> },
  { name: 'Support', href: '/admin/support', icon: <MdOutlineSupportAgent size={20} /> },
  { name: 'Containers', href: '/admin/containers', icon: <GiCargoShip size={18} /> }, // ✅ NEW
  { name: 'Goods Types', href: '/admin/goods', icon: <TbBox size={18} /> },     // ✅ NEW
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen bg-zinc-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between py-6 px-4">
          <div>
            <div className="mb-8 px-2">
              <h1 className="text-xl font-bold text-white tracking-wider">
                🛡️ Admin<span className="text-yellow-400">Panel</span>
              </h1>
            </div>
            <nav className="space-y-2">
              {adminLinks.map((link) => {
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

          {/* Footer */}
          <div className="text-sm text-zinc-500 px-2 mt-6">
            <div className="flex items-center gap-2">
              <MdOutlineSettings size={18} />
              <span className="truncate">Admin Access</span>
            </div>
            <p className="text-xs mt-1">Control Panel</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
