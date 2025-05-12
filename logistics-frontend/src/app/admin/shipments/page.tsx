'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface Shipment {
  _id: string;
  trackingNumber: string;
  status: string;
  pickupLocation?: { name: string };
  dropOffLocation?: { name: string };
  estimatedDeliveryDate?: string;
}

interface Location {
  _id: string;
  name: string;
  type: 'pickup' | 'drop-off';
  status?: string;
}

interface Quote {
  _id: string;
  pickupLocation?: { _id: string; name: string };
  dropLocation?: { _id: string; name: string };
  status: string;
}

interface GoodsType {
  _id: string;
  name: string;
  status?: string;
}

interface ContainerType {
  _id: string;
  name: string;
  status?: string;
}

const statusOptions = ['pending', 'shipped', 'in-transit', 'delivered'];

function ShipmentsContent() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<Location[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [goodsTypes, setGoodsTypes] = useState<GoodsType[]>([]);
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([]);
  const [error, setError] = useState('');
  const [newShipment, setNewShipment] = useState({
    quoteRequestId: '',
    trackingNumber: '',
    pickupLocation: '',
    dropOffLocation: '',
    goodsType: '',
    containerType: '',
    estimatedDeliveryDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

        const [shipmentsData, locationsData, quotesData, goodsData, containersData] = await Promise.all([
          safeFetch(`${BASE}/api/shipments`),
          safeFetch(`${BASE}/api/locations?showAll=true`),
          safeFetch(`${BASE}/api/quotes`),
          safeFetch(`${BASE}/api/goods?showAll=true`),
          safeFetch(`${BASE}/api/containers?showAll=true`),
        ]);

        setShipments(shipmentsData?.shipments || []);

        const activeLocations = (locationsData?.locations || []).filter((loc: Location) => loc.status === 'active');
        setPickupLocations(activeLocations.filter((loc: Location) => loc.type === 'pickup'));
        setDropOffLocations(activeLocations.filter((loc: Location) => loc.type === 'drop-off'));

        const quoted = (quotesData?.quotes || []).filter((q: Quote) => q.status === 'Quoted');
        setQuotes(quoted);

        setGoodsTypes((goodsData?.types || []).filter((g: GoodsType) => g.status === 'active'));
        setContainerTypes((containersData?.types || []).filter((c: ContainerType) => c.status === 'active'));
      } catch (error: unknown) {
        const err = error as Error;
        toast.error('Failed to load data');
        setError(err.message || 'Could not fetch shipments or related data.');
      }
    };

    fetchData();
  }, []);

  const handleCreateShipment = async () => {
    const { quoteRequestId, trackingNumber, pickupLocation, dropOffLocation, goodsType, containerType } = newShipment;

    if (!quoteRequestId || !pickupLocation || !dropOffLocation || !trackingNumber || !goodsType || !containerType) {
      setError('⚠️ All fields are required.');
      return;
    }

    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch(`${BASE}/api/shipments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipment),
      });

      if (data?.shipment) {
        setShipments((prev) => [...prev, data.shipment]);
        toast.success('Shipment created');
        setNewShipment({
          quoteRequestId: '',
          trackingNumber: '',
          pickupLocation: '',
          dropOffLocation: '',
          goodsType: '',
          containerType: '',
          estimatedDeliveryDate: '',
        });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Error creating shipment');
    }
  };

  const handleDeleteShipment = async (id: string) => {
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch(`${BASE}/api/shipments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res) {
      setShipments((prev) => prev.filter((s) => s._id !== id));
      toast.success('Shipment deleted');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch(`${BASE}/api/shipments/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res) {
      setShipments((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
      toast.success('Status updated');
    }
  };

  return (
    <section className="p-4 md:p-6 lg:p-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">
          Manage Shipments
        </h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Create, track, and update shipments globally.</p>
      </div>

      {/* Create Shipment */}
      <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Shipment</h2>
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <select
            value={newShipment.quoteRequestId}
            onChange={(e) => {
              const quote = quotes.find((q) => q._id === e.target.value);
              setNewShipment({
                ...newShipment,
                quoteRequestId: e.target.value,
                pickupLocation: quote?.pickupLocation?._id || '',
                dropOffLocation: quote?.dropLocation?._id || '',
              });
            }}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Quoted Request</option>
            {quotes.map((q) => (
              <option key={q._id} value={q._id}>
                {q._id.slice(0, 6)} | {q.pickupLocation?.name} → {q.dropLocation?.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newShipment.trackingNumber}
            onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
            placeholder="Tracking Number"
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          />

          <select
            value={newShipment.pickupLocation}
            onChange={(e) => setNewShipment({ ...newShipment, pickupLocation: e.target.value })}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Pickup Location</option>
            {pickupLocations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={newShipment.dropOffLocation}
            onChange={(e) => setNewShipment({ ...newShipment, dropOffLocation: e.target.value })}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Drop-off Location</option>
            {dropOffLocations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={newShipment.goodsType}
            onChange={(e) => setNewShipment({ ...newShipment, goodsType: e.target.value })}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Goods Type</option>
            {goodsTypes.map((g) => (
              <option key={g._id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={newShipment.containerType}
            onChange={(e) => setNewShipment({ ...newShipment, containerType: e.target.value })}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          >
            <option value="">Select Container Type</option>
            {containerTypes.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={newShipment.estimatedDeliveryDate}
            onChange={(e) => setNewShipment({ ...newShipment, estimatedDeliveryDate: e.target.value })}
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
          />

          <button
            onClick={handleCreateShipment}
            className="bg-[#902f3c] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            ➕ Create Shipment
          </button>
        </div>
      </div>

      {/* Shipment Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-700 bg-[#111111]">
        <table className="min-w-[900px] w-full text-sm sm:text-base divide-y divide-gray-700">
          <thead className="bg-[#1b1b1b]">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-white uppercase">Tracking #</th>
              <th className="px-6 py-4 text-left font-bold text-white uppercase">Pickup</th>
              <th className="px-6 py-4 text-left font-bold text-white uppercase">Drop-off</th>
              <th className="px-6 py-4 text-center font-bold text-white uppercase">Status</th>
              <th className="px-6 py-4 text-center font-bold text-white uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#111111] divide-y divide-gray-700">
            {shipments.map((shipment) => (
              <motion.tr
                key={shipment._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <td className="px-6 py-4 text-white">{shipment.trackingNumber}</td>
                <td className="px-6 py-4 text-white">{shipment.pickupLocation?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-white">{shipment.dropOffLocation?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={shipment.status}
                    onChange={(e) => handleUpdateStatus(shipment._id, e.target.value)}
                    className="bg-[#902f3c] text-white px-4 py-2 rounded-xl focus:outline-none hover:opacity-90 transition"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteShipment(shipment._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:opacity-90 transition"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminShipmentsPage() {
  return (
    <ProtectedRoute adminOnly>
      <ShipmentsContent />
    </ProtectedRoute>
  );
}
