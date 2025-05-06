'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface DashboardCounts {
  quotes: number;
  shipments: number;
  services: number;
  messages: number;
  locations: number;
  goodsTypes: number;
  containerTypes: number;
}

interface Quote {
  _id: string;
  status: string;
  paymentTerm: string;
  createdAt: string;
}

interface Shipment {
  _id: string;
  trackingNumber: string;
  status: string;
  shipmentDate: string;
}

interface Message {
  _id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: string;
}

function DashboardContent() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [latestQuotes, setLatestQuotes] = useState<Quote[]>([]);
  const [latestShipments, setLatestShipments] = useState<Shipment[]>([]);
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Step 1: Check content type safely
      const contentType = res.headers.get('content-type') || '';
      let data;
  
      // Step 2: Try to parse correctly
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`❌ Server responded with non-JSON: ${text.slice(0, 100)}...`);
      }
  
      // Step 3: Handle HTTP errors cleanly
      if (!res.ok) {
        throw new Error(data.message || `❌ Failed to fetch ${url}`);
      }
  
      return data;
    } catch (err: any) {
      console.error(`🔴 Error fetching ${url}:`, err);
      toast.error(err.message || `Failed to load ${url.split('/api/')[1] || 'data'}`);
      return null;
    }
  };
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [
        quotesData,
        shipmentsData,
        servicesData,
        messagesData,
        locationsData,
        goodsTypesData,
        containerTypesData,
      ] = await Promise.all([
        safeFetch('http://localhost:8000/api/quotes'),
        safeFetch('http://localhost:8000/api/shipments'),
        safeFetch('http://localhost:8000/api/services'),
        safeFetch('http://localhost:8000/api/contact'),
        safeFetch('http://localhost:8000/api/locations'),
        safeFetch('http://localhost:8000/api/goods'),
        safeFetch('http://localhost:8000/api/containers'),
      ]);

      setCounts({
        quotes: quotesData?.quotes?.length || 0,
        shipments: shipmentsData?.shipments?.length || 0,
        services: servicesData?.services?.length || 0,
        messages: messagesData?.messages?.length || 0,
        locations: locationsData?.locations?.length || 0,
        goodsTypes: goodsTypesData?.types?.length || 0,
        containerTypes: containerTypesData?.types?.length || 0,
      });

      setLatestQuotes(quotesData?.quotes?.slice(0, 5) || []);
      setLatestShipments(shipmentsData?.shipments?.slice(0, 5) || []);
      setLatestMessages(messagesData?.messages?.slice(0, 5) || []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse">Loading dashboard...</div>
      </section>
    );
  }

  if (!counts) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-red-500 font-semibold">Failed to load dashboard data.</div>
      </section>
    );
  }

  const dashboardData = [
    { title: 'Total Quotes', value: counts.quotes },
    { title: 'Total Shipments', value: counts.shipments },
    { title: 'Total Services', value: counts.services },
    { title: 'Total Locations', value: counts.locations },
    { title: 'Total Messages', value: counts.messages },
    { title: 'Goods Types', value: counts.goodsTypes },
    { title: 'Container Types', value: counts.containerTypes },
  ];

  return (
    <section className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#902f3c] dark:text-[#ffcc00]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Monitor all logistics operations in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dashboardData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="rounded-2xl border border-gray-300 dark:border-gray-700 p-6 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#111111]">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.title}</h2>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-[#902f3c] dark:text-[#ffcc00]">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Quotes</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {latestQuotes.length ? (
              latestQuotes.map((quote) => (
                <div key={quote._id} className="flex justify-between text-sm">
                  <span>{quote.status} • {quote.paymentTerm}</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>No recent quotes.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Shipments</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {latestShipments.length ? (
              latestShipments.map((shipment) => (
                <div key={shipment._id} className="flex justify-between text-sm">
                  <span>{shipment.trackingNumber}</span>
                  <span>{new Date(shipment.shipmentDate).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>No recent shipments.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-md border">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Messages</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {latestMessages.length ? (
              latestMessages.map((msg) => (
                <div key={msg._id} className="flex justify-between text-sm">
                  <span>{msg.name} • {msg.subject}</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p>No recent messages.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/admin/shipments/create" className="bg-[#902f3c] text-white px-5 py-3 rounded-lg hover:opacity-90 transition">
          ➕ Create Shipment
        </Link>
        <Link href="/admin/quotes" className="bg-[#ffcc00] text-black px-5 py-3 rounded-lg hover:opacity-90 transition">
          📦 Manage Quotes
        </Link>
        <Link href="/admin/support" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:opacity-90 transition">
          💬 View Messages
        </Link>
        <Link href="/admin/services" className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:opacity-90 transition">
          🛠️ Manage Services
        </Link>
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <DashboardContent />
    </ProtectedRoute>
  );
}

