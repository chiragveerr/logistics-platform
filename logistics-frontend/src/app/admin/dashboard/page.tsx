'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

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

  const safeFetch = async <T = unknown>(url: string): Promise<T | null> => {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`❌ Non-JSON response: ${text.slice(0, 100)}...`);
      }

      const data: T = await res.json();

      if (!res.ok) {
        const errMessage =
          (data as { message?: string })?.message ??
          `❌ Failed to fetch ${url}`;
        throw new Error(errMessage);
      }

      return data;
    } catch (err) {
      const error = err as Error;
      console.error(`🔴 Error fetching ${url}:`, error);
      toast.error(error.message || `Failed to load ${url}`);
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse">
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (!counts) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-red-500 font-semibold">
          Failed to load dashboard data.
        </div>
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {item.title}
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Latest Quotes</h3>
          <ul className="space-y-3">
            {latestQuotes.map((quote) => (
              <li
                key={quote._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: <strong>{quote.status}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Payment: {quote.paymentTerm}
                </p>
                <p className="text-xs text-gray-500">
                  Created at: {new Date(quote.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Latest Shipments</h3>
          <ul className="space-y-3">
            {latestShipments.map((shipment) => (
              <li
                key={shipment._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tracking: <strong>{shipment.trackingNumber}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
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

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Latest Messages</h3>
        <ul className="space-y-3">
          {latestMessages.map((message) => (
            <li
              key={message._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                From: <strong>{message.name}</strong> | Subject: {message.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Status: {message.status}
              </p>
              <p className="text-xs text-gray-500">
                Received: {new Date(message.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-right">
        <Link href="/admin/quotes">
          <span className="text-blue-600 hover:underline">View all quotes →</span>
        </Link>
      </div>
    </section>
  );
}

// ==========================
// Protected Page Wrapper
// ==========================

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <DashboardContent />
    </ProtectedRoute>
  );
}
