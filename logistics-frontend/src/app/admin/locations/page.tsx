'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface Location {
  _id: string;
  name: string;
  type: 'pickup' | 'drop-off';
  country: string;
  city: string;
  address: string;
  postalCode: string;
  coordinates: [number, number];
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

type NewLocationState = {
  name: string;
  type: 'pickup' | 'drop-off';
  country: string;
  city: string;
  address: string;
  postalCode: string;
  coordinates: [string, string];
};

export default function AdminLocationsPage(): JSX.Element {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pickup' | 'drop-off'>('all');

  const [newLocation, setNewLocation] = useState<NewLocationState>({
    name: '',
    type: 'pickup',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    coordinates: ['', ''],
  });

  // Throttle fetchLocations to prevent spamming on filter change
  const fetchLocations = useCallback(async () => {
    const res = await safeFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`);
    if (!res?.locations) return;

    const all = res.locations as Location[];
    const filtered =
      filterType === 'pickup'
        ? all.filter((l) => l.type === 'pickup')
        : filterType === 'drop-off'
        ? all.filter((l) => l.type === 'drop-off')
        : all;

    setLocations(filtered);
  }, [filterType]);

  useEffect(() => {
    fetchLocations().finally(() => setLoading(false));
  }, [fetchLocations]);

  // Debounce create to prevent double submit
  const handleCreateLocation = async (): Promise<void> => {
    const { name, type, country, city, address, postalCode, coordinates } = newLocation;

    if (
      !name.trim() ||
      !type ||
      !country.trim() ||
      !city.trim() ||
      !address.trim() ||
      !postalCode.trim() ||
      !coordinates[0].trim() ||
      !coordinates[1].trim()
    ) {
      setError('⚠️ Please fill all required fields.');
      return;
    }

    setError('');
    const formattedCoordinates: [number, number] = [
      parseFloat(coordinates[0]),
      parseFloat(coordinates[1]),
    ];

    const res = await safeFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...newLocation, coordinates: formattedCoordinates }),
      },
      { debounce: true }
    );

    if (res?.location) {
      setLocations((prev) => [...prev, res.location]);
      toast.success('📍 Location created');
      setNewLocation({
        name: '',
        type: 'pickup',
        country: '',
        city: '',
        address: '',
        postalCode: '',
        coordinates: ['', ''],
      });
    }
  };

  // Throttle delete to prevent rapid delete clicks
  const handleDeleteLocation = async (id: string): Promise<void> => {
    const res = await safeFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
      { throttle: true }
    );

    if (res?.success) {
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
      toast.success('🗑️ Location deleted');
    }
  };

  // Throttle status update to prevent rapid toggling
  const handleUpdateStatus = async (id: string, newStatus: 'active' | 'inactive'): Promise<void> => {
    const res = await safeFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations/${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      },
      { throttle: true }
    );

    if (res?.success) {
      setLocations((prev) =>
        prev.map((loc) => (loc._id === id ? { ...loc, status: newStatus } : loc))
      );
      toast.success('✅ Status updated');
    }
  };

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse text-white">Loading locations...</div>
      </section>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <section className="p-4 md:p-6 lg:p-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">
            Manage Locations
          </h1>
          <p className="text-gray-300 mt-2 text-base sm:text-lg">
            Create, activate, deactivate locations smoothly.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'pickup' | 'drop-off')}
            className="p-2 bg-[#1b1b1b] text-white border border-gray-700 rounded-lg"
          >
            <option value="all">Show All</option>
            <option value="pickup">Pickup Locations</option>
            <option value="drop-off">Drop-off Locations</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        {/* ➕ Create Form */}
        <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Location</h2>
          <div className="flex flex-col gap-4">
            <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Location Name" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            <select value={newLocation.type} onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as 'pickup' | 'drop-off' })} className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700">
              <option value="pickup">Pickup</option>
              <option value="drop-off">Drop-off</option>
            </select>
            <input type="text" value={newLocation.country} onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })} placeholder="Country" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            <input type="text" value={newLocation.city} onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })} placeholder="City" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            <input type="text" value={newLocation.address} onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} placeholder="Address" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            <input type="text" value={newLocation.postalCode} onChange={(e) => setNewLocation({ ...newLocation, postalCode: e.target.value })} placeholder="Postal Code" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            <div className="flex gap-4">
              <input type="text" value={newLocation.coordinates[0]} onChange={(e) => setNewLocation({ ...newLocation, coordinates: [e.target.value, newLocation.coordinates[1]] })} placeholder="Longitude" className="p-3 w-1/2 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
              <input type="text" value={newLocation.coordinates[1]} onChange={(e) => setNewLocation({ ...newLocation, coordinates: [newLocation.coordinates[0], e.target.value] })} placeholder="Latitude" className="p-3 w-1/2 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
            </div>
            <button onClick={handleCreateLocation} className="bg-[#902f3c] text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition">➕ Create Location</button>
          </div>
        </div>

        {/* 📋 Locations Table */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-700 bg-[#111111]">
          <table className="min-w-[900px] w-full divide-y divide-gray-700">
            <thead className="bg-[#1b1b1b]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">City</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Country</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#111111] divide-y divide-gray-700">
              {locations.map((loc) => (
                <motion.tr key={loc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <td className="px-6 py-4 text-white">{loc.name}</td>
                  <td className="px-6 py-4 text-white capitalize">{loc.type}</td>
                  <td className="px-6 py-4 text-white">{loc.city}</td>
                  <td className="px-6 py-4 text-white">{loc.country}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={loc.status}
                      onChange={(e) =>
                        handleUpdateStatus(loc._id, e.target.value as 'active' | 'inactive')
                      }
                      className="bg-[#902f3c] text-white px-4 py-2 rounded-xl focus:outline-none hover:opacity-90 transition"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteLocation(loc._id)}
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
    </ProtectedRoute>
  );
}
