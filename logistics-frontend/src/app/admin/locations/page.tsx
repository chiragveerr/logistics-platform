'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface Location {
  _id: string;
  name?: string;
  type?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  coordinates?: [number, number];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

function LocationsContent() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pickup' | 'drop-off'>('all');

  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'pickup',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    coordinates: ['', ''],
  });

  const fetchLocations = async () => {
    const data = await safeFetch('http://localhost:8000/api/locations');
    if (!data) return;

    const all = data.locations || [];
    const filtered =
      filterType === 'pickup'
        ? all.filter((l: Location) => l.type === 'pickup')
        : filterType === 'drop-off'
        ? all.filter((l: Location) => l.type === 'drop-off')
        : all;

    setLocations(filtered);
  };

  useEffect(() => {
    fetchLocations().finally(() => setLoading(false));
  }, [filterType]);

  const handleCreateLocation = async () => {
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
    const formattedCoordinates = [
      parseFloat(coordinates[0]),
      parseFloat(coordinates[1]),
    ];

    const data = await safeFetch('http://localhost:8000/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...newLocation, coordinates: formattedCoordinates }),
    });

    if (data?.location) {
      setLocations((prev) => [...prev, data.location]);
      toast.success('Location created');
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

  const handleDeleteLocation = async (id: string) => {
    const res = await safeFetch(`http://localhost:8000/api/locations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res) {
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
      toast.success('Location deleted');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await safeFetch(`http://localhost:8000/api/locations/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res) {
      setLocations((prev) =>
        prev.map((loc) => (loc._id === id ? { ...loc, status: newStatus } : loc))
      );
      toast.success('Status updated');
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
    <section className="p-4 md:p-6 lg:p-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">
          Manage Locations
        </h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">
          Create, activate, deactivate locations smoothly.
        </p>
      </div>

      {/* Filter by Pickup/Drop-off */}
      <div className="mb-6 flex justify-end">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
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

      {/* Create Form */}
      <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Location</h2>
        <div className="flex flex-col gap-4">
          <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Location Name" className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700" />
          <select value={newLocation.type} onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })} className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700">
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

      {/* Locations Table */}
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
                <td className="px-6 py-4 text-white">{loc.name || 'N/A'}</td>
                <td className="px-6 py-4 text-white capitalize">{loc.type || 'N/A'}</td>
                <td className="px-6 py-4 text-white">{loc.city || 'N/A'}</td>
                <td className="px-6 py-4 text-white">{loc.country || 'N/A'}</td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={loc.status || 'inactive'}
                    onChange={(e) => handleUpdateStatus(loc._id, e.target.value)}
                    className="bg-[#902f3c] text-white dark:bg-[#ffcc00] dark:text-black px-4 py-2 rounded-xl focus:outline-none hover:opacity-90 transition"
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
  );
}

export default function AdminLocationsPage() {
  return (
    <ProtectedRoute adminOnly>
      <LocationsContent />
    </ProtectedRoute>
  );
}
