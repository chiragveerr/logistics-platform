'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import safeFetch from '@/utils/safeFetch';

// ==========================
// Types
// ==========================

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

interface ApiQuotesResponse {
  quotes: Quote[];
}

interface ApiShipmentsResponse {
  shipments: Shipment[];
}

interface ApiMessagesResponse {
  messages: Message[];
}

interface ApiGenericArrayResponse<T> {
  [key: string]: T[];
}

// ==========================
// Dashboard Component
// ==========================

function DashboardContent() {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [latestQuotes, setLatestQuotes] = useState<Quote[]>([]);
  const [latestShipments, setLatestShipments] = useState<Shipment[]>([]);
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Use throttle for dashboard data (prevents spamming on fast reloads)
      // Use debounce for endpoints that could be triggered by user input (none here)
      const [
        quotesData,
        shipmentsData,
        servicesData,
        messagesData,
        locationsData,
        goodsTypesData,
        containerTypesData,
      ] = await Promise.all([
        safeFetch<ApiQuotesResponse>(`${BASE}/api/quotes`),
        safeFetch<ApiShipmentsResponse>(`${BASE}/api/shipments`),
        safeFetch<ApiGenericArrayResponse<unknown>>(`${BASE}/api/services`),
        safeFetch<ApiMessagesResponse>(`${BASE}/api/contact`),
        safeFetch<ApiGenericArrayResponse<unknown>>(`${BASE}/api/locations`),
        safeFetch<ApiGenericArrayResponse<unknown>>(`${BASE}/api/goods`),
        safeFetch<ApiGenericArrayResponse<unknown>>(`${BASE}/api/containers`),
      ]);

      setCounts({
        quotes: quotesData?.quotes?.length ?? 0,
        shipments: shipmentsData?.shipments?.length ?? 0,
        services: servicesData?.services?.length ?? 0,
        messages: messagesData?.messages?.length ?? 0,
        locations: locationsData?.locations?.length ?? 0,
        goodsTypes: goodsTypesData?.types?.length ?? 0,
        containerTypes: containerTypesData?.types?.length ?? 0,
      });

      setLatestQuotes(quotesData?.quotes?.slice(0, 5) ?? []);
      setLatestShipments(shipmentsData?.shipments?.slice(0, 5) ?? []);
      setLatestMessages(messagesData?.messages?.slice(0, 5) ?? []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh] bg-[#1b1b1b]">
        <div className="text-xl font-semibold animate-pulse text-[#ffcc00]">
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (!counts) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh] bg-[#1b1b1b]">
        <div className="text-red-500 font-semibold">
          Failed to load dashboard data.
        </div>
      </section>
    );
  }

  const dashboardData = [
    { title: 'Total Quotes', value: counts.quotes, color: 'text-[#ffcc00]' },
    { title: 'Total Shipments', value: counts.shipments, color: 'text-[#902f3c]' },
    { title: 'Total Services', value: counts.services, color: 'text-[#ffcc00]' },
    { title: 'Total Locations', value: counts.locations, color: 'text-[#902f3c]' },
    { title: 'Total Messages', value: counts.messages, color: 'text-[#ffcc00]' },
    { title: 'Goods Types', value: counts.goodsTypes, color: 'text-[#902f3c]' },
    { title: 'Container Types', value: counts.containerTypes, color: 'text-[#ffcc00]' },
  ];

  return (
    <section className="p-6 md:p-10 bg-[#121212] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#ffcc00]">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1b1b1b] rounded-lg p-6 shadow-lg border border-gray-700"
          >
            <h2 className={`text-xl font-semibold mb-3 ${item.color}`}>
              {item.title}
            </h2>
            <p className="text-4xl font-extrabold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Latest Entries */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Latest Quotes */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-[#ffcc00]">Latest Quotes</h3>
          <ul className="space-y-3">
            {latestQuotes.map((quote) => (
              <li
                key={quote._id}
                className="bg-[#1b1b1b] p-5 rounded shadow border border-gray-700"
              >
                <p className="text-sm text-gray-300">
                  Status: <strong className="text-[#902f3c]">{quote.status}</strong>
                </p>
                <p className="text-sm text-gray-300">
                  Payment: {quote.paymentTerm}
                </p>
                <p className="text-xs text-gray-500">
                  Created at: {new Date(quote.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest Shipments */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-[#ffcc00]">Latest Shipments</h3>
          <ul className="space-y-3">
            {latestShipments.map((shipment) => (
              <li
                key={shipment._id}
                className="bg-[#1b1b1b] p-5 rounded shadow border border-gray-700"
              >
                <p className="text-sm text-gray-300">
                  Tracking: <strong className="text-[#902f3c]">{shipment.trackingNumber}</strong>
                </p>
                <p className="text-sm text-gray-300">
                  Status: {shipment.status}
                </p>
                <p className="text-xs text-gray-500">
                  Shipment Date: {new Date(shipment.shipmentDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Latest Messages */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-[#ffcc00]">Latest Messages</h3>
        <ul className="space-y-3">
          {latestMessages.map((msg) => (
            <li
              key={msg._id}
              className="bg-[#1b1b1b] p-5 rounded shadow border border-gray-700 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg text-[#902f3c]">{msg.subject}</p>
                <p className="text-sm text-gray-300">From: {msg.name}</p>
                <p className="text-xs text-gray-500">Status: {msg.status}</p>
              </div>
              <Link
                href={`/admin/messages/${msg._id}`}
                className="text-[#ffcc00] hover:underline font-semibold"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ==========================
// Page Export
// ==========================

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
