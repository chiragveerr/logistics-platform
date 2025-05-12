'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaShippingFast, FaQuoteRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

type Shipment = { _id: string; status: string };

export default function DashboardPage() {
  const [userName, setUserName] = useState('User');
  const [quoteCount, setQuoteCount] = useState(0);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const userData = await safeFetch(`${BASE}/api/users/profile`, {
        credentials: 'include',
      });

      if (!userData?.user) {
        toast.error('Please login to access dashboard');
        router.push('/login');
        return;
      }

      setUserName(userData.user.name);

      const quoteData = await safeFetch(`${BASE}/api/quotes/my`, {
        credentials: 'include',
      });
      setQuoteCount(quoteData?.quotes?.length || 0);

      const shipmentData = await safeFetch(`${BASE}/api/shipments`, {
        credentials: 'include',
      });
      const userShipments = shipmentData?.shipments?.filter((s: Shipment) => s._id);
      setShipmentCount(userShipments?.length || 0);

      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return null;

  return (
    <section className="text-white">
      <h1 className="text-3xl font-semibold mb-4">Good Morning, {userName} 👋</h1>
      <p className="text-zinc-400 mb-8">Welcome back to your dashboard. Here’s a quick overview:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-md">
          <FaQuoteRight size={30} className="text-yellow-400" />
          <div>
            <p className="text-lg font-semibold">{quoteCount}</p>
            <p className="text-sm text-zinc-400">Quotes Requested</p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 flex items-center gap-4 shadow-md">
          <FaShippingFast size={30} className="text-yellow-400" />
          <div>
            <p className="text-lg font-semibold">{shipmentCount}</p>
            <p className="text-sm text-zinc-400">Shipments Tracked</p>
          </div>
        </div>
      </div>
    </section>
  );
}
