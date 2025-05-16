'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
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

const statusOptions = [
  'pending',
  'picked up',
  'in transit',
  'custom clearance',
  'arrived at destination',
  'out for delivery',
  'delivered',
];

export default function AdminTrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentId, setShipmentId] = useState('');
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    event: '',
    location: '',
    status: '',
    eventTime: '',
    remarks: '',
  });

  // Throttle fetchShipments to prevent spamming
  const fetchShipments = async () => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch<{ shipments: Shipment[] }>(`${BASE}/api/shipments`);
      setShipments(data?.shipments || []);
    } catch {
      toast.error('Failed to fetch shipments');
    }
  };

  // Throttle fetchTrackingEvents to prevent spamming
  const fetchTrackingEvents = async () => {
    if (!shipmentId) return toast.error('Select a shipment first');
    setLoading(true);
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch<{ events: TrackingEvent[] }>(`${BASE}/api/tracking/${shipmentId}`, undefined, { throttle: true });
      setEvents(data?.events || []);
    } catch {
      toast.error('Failed to fetch tracking events');
    } finally {
      setLoading(false);
    }
  };

  // Debounce create event to prevent double submit
  const handleCreateEvent = async () => {
    const { event, location, status, eventTime } = newEvent;
    if (!shipmentId || !event || !location || !status || !eventTime) {
      return toast.error('Please fill all required fields');
    }

    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch<{ trackingEvent: TrackingEvent }>(`${BASE}/api/tracking`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, shipment: shipmentId }),
      }, { debounce: true });

      if (!data?.trackingEvent) throw new Error('Creation failed');

      toast.success('Tracking event created');
      setEvents((prev) => [...prev, data.trackingEvent]);
      setNewEvent({ event: '', location: '', status: '', eventTime: '', remarks: '' });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to create tracking event');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <section className="p-6 md:p-10">
        <h1 className="text-4xl font-bold text-[#ffcc00] text-center mb-8">📍 Manage Tracking Events</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            className="p-3 rounded bg-zinc-800 text-white border border-zinc-600 w-full md:w-1/2"
          >
            <option value="">Select Shipment</option>
            {shipments.map((s) => (
              <option key={s._id} value={s._id}>
                {s.trackingNumber}
              </option>
            ))}
          </select>
          <button
            onClick={fetchTrackingEvents}
            className="bg-[#902f3c] text-white px-6 py-3 rounded-lg font-bold"
          >
            🔍 Fetch Events
          </button>
        </div>

        {shipmentId && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 mb-10">
            <h2 className="text-xl font-bold text-white mb-4">➕ Create Tracking Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.event}
                onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })}
                className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <select
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
              >
                <option value="">Select Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={newEvent.eventTime}
                onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <textarea
                placeholder="Remarks (optional)"
                value={newEvent.remarks}
                onChange={(e) => setNewEvent({ ...newEvent, remarks: e.target.value })}
                className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 col-span-1 md:col-span-2"
              />
            </div>
            <button
              onClick={handleCreateEvent}
              className="mt-4 bg-[#ffcc00] text-black font-bold py-2 px-6 rounded hover:opacity-90"
            >
              Create Event
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white">Loading events...</div>
        ) : (
          events.length > 0 && (
            <div className="overflow-x-auto bg-[#111111] rounded-xl border border-zinc-700">
              <table className="min-w-[900px] w-full text-white divide-y divide-gray-700">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left">Event</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <motion.tr key={e._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td className="px-6 py-4">{e.event}</td>
                      <td className="px-6 py-4">{e.location}</td>
                      <td className="px-6 py-4 capitalize">{e.status}</td>
                      <td className="px-6 py-4">{new Date(e.eventTime).toLocaleString()}</td>
                      <td className="px-6 py-4">{e.remarks || '—'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
    </ProtectedRoute>
  );
}