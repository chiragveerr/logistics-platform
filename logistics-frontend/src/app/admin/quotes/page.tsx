'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Quote {
  _id: string;
  user: { _id: string; name: string; email: string };
  pickupLocation: { _id: string; name: string };
  dropLocation: { _id: string; name: string };
  goodsType: { _id: string; name: string };
  containerType: { _id: string; name: string };
  status: string;
  paymentTerm: string;
  finalQuoteAmount?: number;
  createdAt: string;
}

function QuotesContent() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalPrices, setFinalPrices] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${BASE}/api/quotes`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch quotes');
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Error fetching quotes:', err.message);
        toast.error('Failed to load quotes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleUpdate = async (id: string, newStatus: string, finalPrice?: number) => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${BASE}/api/quotes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, finalQuoteAmount: finalPrice }),
      });

      if (!res.ok) throw new Error('Failed to update quote');

      const updatedQuotes = quotes.map((quote) =>
        quote._id === id ? { ...quote, status: newStatus, finalQuoteAmount: finalPrice } : quote
      );

      toast.success('Quote updated');
      setQuotes(updatedQuotes);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error updating quote:', err.message);
      toast.error('Failed to update quote');
    }
  };

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse text-white">Loading quotes...</div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">Manage Quotes</h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Control customer quotes and pricing dynamically.</p>
      </div>

      <div className="overflow-x-auto w-full rounded-2xl shadow-2xl border border-gray-700 bg-[#111111]">
        <table className="min-w-[900px] w-full text-sm sm:text-base divide-y divide-gray-700">
          <thead className="bg-[#1b1b1b]">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-white uppercase">Customer</th>
              <th className="px-4 py-3 text-left font-bold text-white uppercase">Pickup</th>
              <th className="px-4 py-3 text-left font-bold text-white uppercase">Drop</th>
              <th className="px-4 py-3 text-left font-bold text-white uppercase">Goods</th>
              <th className="px-4 py-3 text-left font-bold text-white uppercase">Payment</th>
              <th className="px-4 py-3 text-center font-bold text-white uppercase">Status</th>
              <th className="px-4 py-3 text-center font-bold text-white uppercase">Final Price ($)</th>
              <th className="px-4 py-3 text-center font-bold text-white uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-[#111111] divide-y divide-gray-700">
            {quotes.map((quote) => (
              <motion.tr
                key={quote._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td className="px-4 py-3 text-white whitespace-nowrap">
                  <div>{quote.user?.name || quote.user?.email || 'Unknown'}</div>
                  <div className="text-xs text-zinc-400 mt-1">#{quote._id.slice(0, 6)}</div>
                </td>
                <td className="px-4 py-3 text-white">{quote.pickupLocation?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-white">{quote.dropLocation?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-white">{quote.goodsType?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-white">{quote.paymentTerm || 'N/A'}</td>
                <td className="px-4 py-3 font-bold text-[#ffcc00] text-center">{quote.status}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    value={finalPrices[quote._id] || quote.finalQuoteAmount || ''}
                    onChange={(e) => setFinalPrices({ ...finalPrices, [quote._id]: e.target.value })}
                    placeholder="Price"
                    className="w-24 px-2 py-1 rounded-md border border-gray-700 bg-[#1b1b1b] text-white focus:ring-2 focus:ring-[#ffcc00]"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={quote.status}
                    onChange={(e) =>
                      handleUpdate(
                        quote._id,
                        e.target.value,
                        Number(finalPrices[quote._id]) || quote.finalQuoteAmount
                      )
                    }
                    className="bg-[#902f3c] text-white dark:bg-[#ffcc00] dark:text-black px-4 py-2 rounded-xl focus:outline-none hover:opacity-90 transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminQuotesPage() {
  return (
    <ProtectedRoute adminOnly>
      <QuotesContent />
    </ProtectedRoute>
  );
}
