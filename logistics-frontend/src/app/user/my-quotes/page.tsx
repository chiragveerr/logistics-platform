'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

type Quote = {
  _id: string;
  status: string;
  finalQuoteAmount?: number;
  containerType: { name: string };
  pickupLocation: { city: string; country: string };
  dropLocation: { city: string; country: string };
  createdAt: string;
};

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuotes = async () => {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch(
        `${BASE}/api/quotes/my`,
        { credentials: 'include' },

      );

      if (!data?.quotes) {
        toast.error('Please login to view your quotes');
        router.push('/login');
        return;
      }

      setQuotes(data.quotes);
      setLoading(false);
    };

    fetchQuotes();
  }, [router]);

  if (loading) return null;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-semibold mb-4">My Quotes 📦</h1>
      <p className="text-zinc-400 mb-6">Here&apos;s a list of all your shipping quote requests.</p>

      {quotes.length === 0 ? (
        <div className="text-zinc-400 text-center py-20">No quote requests found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="py-3 px-4 text-left">Pickup</th>
                <th className="py-3 px-4 text-left">Drop</th>
                <th className="py-3 px-4 text-left">Container</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Final Price ($)</th>
                <th className="py-3 px-4 text-left">Requested On</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote._id} className="border-t border-zinc-700 hover:bg-zinc-800/60">
                  <td className="py-3 px-4">
                    {quote.pickupLocation?.city}, {quote.pickupLocation?.country}
                  </td>
                  <td className="py-3 px-4">
                    {quote.dropLocation?.city}, {quote.dropLocation?.country}
                  </td>
                  <td className="py-3 px-4">{quote.containerType?.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        quote.status === 'Pending'
                          ? 'bg-yellow-500 text-black'
                          : quote.status === 'Quoted'
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-semibold">
                    {quote.finalQuoteAmount ? `$${quote.finalQuoteAmount}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}