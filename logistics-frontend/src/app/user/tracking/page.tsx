'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import safeFetch from '@/utils/safeFetch';

interface Shipment {
  _id: string;
  trackingNumber: string;
}

interface TrackingEvent {
  _id: string;
  event: string;
  location: string;
  status: string;
  eventTime: string;
  remarks?: string;
}

function TrackingContent() {
  const [shipmentId, setShipmentId] = useState('');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 🛩️ Fetch user shipments
  useEffect(() => {
    const fetchUserShipments = async () => {
      const data = await safeFetch(`${BASE}/api/shipments`, {
        credentials: 'include',
      });

      if (data?.shipments) {
        setShipments(data.shipments);
      }
    };

    fetchUserShipments();
  }, [BASE]);

  // 🛰️ Fetch tracking events
  const fetchEvents = async () => {
    if (!shipmentId.trim()) {
      setError('⚠️ Please select a shipment');
      return;
    }

    setError('');
    setLoading(true);

    const data = await safeFetch(`${BASE}/api/tracking/${shipmentId}`, {
      credentials: 'include',
    });

    if (data?.events) {
      setEvents(data.events);
    } else {
      setError('Could not fetch events. Try again.');
      setEvents([]);
    }

    setLoading(false);
  };

  return (
    <section className="p-4 md:p-6 lg:p-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#ffcc00]">Track Your Shipment</h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Select a shipment to view tracking history.</p>
      </div>

      <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            className="flex-1 p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Shipment</option>
            {shipments.map((s) => (
              <option key={s._id} value={s._id}>
                {s.trackingNumber} ({s._id.slice(0, 6)})
              </option>
            ))}
          </select>

          <button
            onClick={fetchEvents}
            className="bg-[#902f3c] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            🔍 Track
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mt-4 text-center font-semibold">
            {error}
          </div>
        )}
      </div>

      {/* 📦 Tracking Events Table */}
      {loading ? (
        <div className="text-white text-center animate-pulse">Loading tracking events...</div>
      ) : events.length === 0 && shipmentId ? (
        <div className="text-white text-center text-lg italic">No tracking events found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-[#111111]">
          <table className="min-w-[1000px] w-full divide-y divide-gray-700">
            <thead className="bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Event</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-[#111111] divide-y divide-gray-700">
              {events.map((event) => (
                <motion.tr
                  key={event._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <td className="px-6 py-4 text-white">{event.event || '—'}</td>
                  <td className="px-6 py-4 text-white">{event.location}</td>
                  <td className="px-6 py-4 text-white capitalize">{event.status}</td>
                  <td className="px-6 py-4 text-white">{new Date(event.eventTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">{event.remarks || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function UserTrackingPage() {
  return (
    <ProtectedRoute>
      <TrackingContent />
    </ProtectedRoute>
  );
}
