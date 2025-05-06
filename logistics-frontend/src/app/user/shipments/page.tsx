'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

interface Shipment {
  _id: string;
  trackingNumber: string;
  status: string;
  pickupLocation?: { name: string };
  dropOffLocation?: { name: string };
  estimatedDeliveryDate?: string;
  createdAt: string;
}

function ShipmentsContent() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserShipments = async () => {
      const data = await safeFetch('http://localhost:8000/api/shipments', {
        credentials: 'include',
      });

      if (!data?.shipments || !Array.isArray(data.shipments)) {
        setError('Could not fetch your shipments.');
        toast.error('Failed to load shipments. Please login again.');
      } else {
        setShipments(data.shipments.filter((s: Shipment) => s && s._id));
      }

      setLoading(false);
    };

    fetchUserShipments();
  }, []);

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh] text-white text-lg">
        <span className="animate-pulse">Loading your shipments...</span>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#ffcc00]">Your Shipments</h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Track all your logistics in one place.</p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md text-center font-semibold mb-6">
          {error}
        </div>
      )}

      {shipments.length === 0 ? (
        <div className="text-white text-center text-lg italic">No shipments found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-[#111111]">
          <table className="min-w-[900px] w-full text-sm sm:text-base divide-y divide-gray-700">
            <thead className="bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-white uppercase">Tracking #</th>
                <th className="px-6 py-4 text-left font-bold text-white uppercase">Pickup</th>
                <th className="px-6 py-4 text-left font-bold text-white uppercase">Drop-off</th>
                <th className="px-6 py-4 text-left font-bold text-white uppercase">Est. Delivery</th>
                <th className="px-6 py-4 text-center font-bold text-white uppercase">Status</th>
                <th className="px-6 py-4 text-center font-bold text-white uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {shipments.map((shipment) => (
                <motion.tr
                  key={shipment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <td className="px-6 py-4 text-white font-mono">{shipment.trackingNumber}</td>
                  <td className="px-6 py-4 text-white">{shipment.pickupLocation?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-white">{shipment.dropOffLocation?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-white">
                    {shipment.estimatedDeliveryDate
                      ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        shipment.status === 'delivered'
                          ? 'bg-green-600'
                          : shipment.status === 'in-transit'
                          ? 'bg-blue-600'
                          : shipment.status === 'pending'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-600'
                      }`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-300">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function UserShipmentsPage() {
  return (
    <ProtectedRoute>
      <ShipmentsContent />
    </ProtectedRoute>
  );
}
