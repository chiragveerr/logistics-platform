'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

interface Service {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const serviceOptions = [
  "Buyers Console",
  "Freight Forwarding Nomination",
  "Air Freight",
  "Courier Shipment",
  "Over Dimensional Cargo",
  "Custom Clearance",
  "Cargo Insurance",
  "Warehouse & Special Racking Solution",
  "Project Cargo",
  "Custom Service",
];

function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newService, setNewService] = useState({ name: '', description: '' });
  const [customServiceMode, setCustomServiceMode] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const data = await safeFetch(`${BASE}/api/services`);
        setServices(data.services || []);
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCreateService = async () => {
    const { name, description } = newService;

    if (!name.trim() || !description.trim()) {
      setError('⚠️ Please fill all required fields.');
      return;
    }

    setError('');

    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const data = await safeFetch(`${BASE}/api/services`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      setServices((prev) => [...prev, data.service]);
      setNewService({ name: '', description: '' });
      setCustomServiceMode(false);
      toast.success('Service created');
    } catch {
      toast.error('Error creating service');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      await safeFetch(`${BASE}/api/services/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success('Service deleted');
    } catch {
      toast.error('Error deleting service');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      await safeFetch(`${BASE}/api/services/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setServices((prev) =>
        prev.map((service) =>
          service._id === id ? { ...service, status: newStatus } : service
        )
      );

      toast.success('Status updated');
    } catch {
      toast.error('Error updating status');
    }
  };

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse text-white">Loading services...</div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">Manage Services</h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Create, update, and delete services easily.</p>
      </div>

      {/* Create Service Form */}
      <div className="bg-[#111111] p-6 rounded-2xl shadow-xl border border-gray-700 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Service</h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!customServiceMode && (
            <select
              value={newService.name}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'Custom Service') {
                  setCustomServiceMode(true);
                  setNewService({ ...newService, name: '' });
                } else {
                  setNewService({ ...newService, name: value });
                }
              }}
              className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700 focus:ring-2 focus:ring-[#ffcc00]"
            >
              <option value="">Select Service</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {customServiceMode && (
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder="Enter Custom Service Name"
              className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700 focus:ring-2 focus:ring-[#ffcc00]"
            />
          )}
          <textarea
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            placeholder="Service Description"
            className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700 focus:ring-2 focus:ring-[#ffcc00]"
            rows={4}
          />
          <button
            onClick={handleCreateService}
            className="bg-[#902f3c] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            ➕ Create Service
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-700 bg-[#111111]">
        <table className="min-w-[700px] w-full text-sm sm:text-base divide-y divide-gray-700">
          <thead className="bg-[#1b1b1b]">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-white uppercase">Name</th>
              <th className="px-6 py-4 text-left font-bold text-white uppercase">Description</th>
              <th className="px-6 py-4 text-center font-bold text-white uppercase">Status</th>
              <th className="px-6 py-4 text-center font-bold text-white uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#111111] divide-y divide-gray-700">
            {services.length ? (
              services.map((service) => (
                <motion.tr
                  key={service._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td className="px-6 py-4 text-white">{service.name || 'Unnamed'}</td>
                  <td className="px-6 py-4 text-white">{service.description || 'No description'}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={service.status}
                      onChange={(e) => handleUpdateStatus(service._id, e.target.value)}
                      className="bg-[#902f3c] text-white dark:bg-[#ffcc00] dark:text-black px-4 py-2 rounded-xl focus:outline-none hover:opacity-90 transition"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="bg-red-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-400 italic">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminServicesPage() {
  return (
    <ProtectedRoute adminOnly>
      <ServicesContent />
    </ProtectedRoute>
  );
}
