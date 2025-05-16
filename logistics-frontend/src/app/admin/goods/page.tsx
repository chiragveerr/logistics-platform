'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface GoodsType {
  _id: string;
  name: string;
  description: string;
  status: string;
}

type FilterStatus = 'all' | 'active' | 'inactive';

const GOODS_OPTIONS: string[] = [
  'Carpets',
  'Handicrafts',
  'Leather Goods',
  'Textile & Apparel',
  'Metal Crafts',
  'Ceramic & Pottery',
  'Wood Crafts',
  'Marble Articles',
  'Jute Products',
  'Fragile Items',
  'Oversized Items',
  'Temperature Controlled',
  'Restricted / Dangerous Goods',
];

export default function AdminGoodsPage() {
  const [goods, setGoods] = useState<GoodsType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [currentGoods, setCurrentGoods] = useState<GoodsType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Throttle fetchGoods to prevent spamming on filter change
  const fetchGoods = useCallback(async () => {
    setLoading(true);
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const data = await safeFetch<{types: GoodsType[]}>(`${BASE}/api/goods`);
    if (!data) return;

    const all = data.types || [];
    const filtered =
      filter === 'active'
        ? all.filter((g: GoodsType) => g.status === 'active')
        : filter === 'inactive'
        ? all.filter((g: GoodsType) => g.status === 'inactive')
        : all;

    setGoods(filtered);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchGoods();
  }, [fetchGoods]);

  // Debounce create to prevent double submit
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch<{ goodsType: GoodsType}>(`${BASE}/api/goods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    }, { debounce: true });

    if (res?.goodsType) {
      toast.success('✅ Goods type created!');
      setGoods((prev) => [...prev, res.goodsType]);
      resetForm();
      setShowCreateForm(false);
    }
  };

  // Debounce edit to prevent double submit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoods) return;

    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch(`${BASE}/api/goods/${currentGoods._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    }, { debounce: true });

    if (res) {
      toast.success('✅ Goods type updated!');
      setGoods((prev) =>
        prev.map((g) =>
          g._id === currentGoods._id ? { ...g, name, description } : g
        )
      );
      resetForm();
      setShowEditForm(false);
    }
  };

  // Throttle status toggle to prevent rapid toggling
  const toggleStatus = async (id: string, status: string) => {
    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch(`${BASE}/api/goods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    }, { throttle: true });

    if (res) {
      toast.success('Status updated');
      fetchGoods();
    }
  };

  // Throttle delete to prevent rapid delete clicks
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goods type?')) return;

    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await safeFetch(`${BASE}/api/goods/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }, { throttle: true });

    if (res) {
      toast.success('Goods type deleted!');
      setGoods((prev) => prev.filter((g) => g._id !== id));
    }
  };

  const openEditForm = (goods: GoodsType) => {
    setCurrentGoods(goods);
    setName(goods.name);
    setDescription(goods.description);
    setShowEditForm(true);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCurrentGoods(null);
    setIsCustom(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400 font-bold text-xl">
        Loading Goods Types...
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 space-y-10 mt-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#ffcc00]">Goods Type Management</h1>
          <div className="flex gap-4 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterStatus)}
              className="p-2 bg-[#1b1b1b] border border-gray-700 text-white rounded-md"
            >
              <option value="all">Show All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#902f3c] text-white px-6 py-2 rounded-lg hover:bg-[#7e2632] transition"
            >
              + Create Goods Type
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {(showCreateForm || showEditForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={showCreateForm ? handleCreate : handleEdit}
              className="bg-[#1b1b1b] text-white p-8 rounded-2xl border border-gray-700 shadow-2xl space-y-6 w-full max-w-lg"
            >
              <h2 className="text-2xl font-bold mb-4 text-[#ffcc00]">
                {showCreateForm ? 'Create New Goods Type' : 'Edit Goods Type'}
              </h2>

              {showCreateForm && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="customToggle"
                      checked={isCustom}
                      onChange={(e) => setIsCustom(e.target.checked)}
                      className="accent-[#902f3c]"
                    />
                    <label htmlFor="customToggle" className="text-sm font-medium text-white">
                      Enter Custom Goods Type
                    </label>
                  </div>

                  {!isCustom ? (
                    <select
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full bg-[#1b1b1b] text-white border border-gray-600 rounded-lg px-4 py-3 mb-4"
                    >
                      <option value="">Select Standard Goods</option>
                      {GOODS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Custom Goods Type Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#1b1b1b] text-white border border-gray-600 rounded-lg px-4 py-3"
                    />
                  )}
                </>
              )}

              {!showCreateForm && (
                <input
                  type="text"
                  placeholder="Goods Type Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#1b1b1b] text-white border border-gray-600 rounded-lg px-4 py-3"
                />
              )}

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="w-full bg-[#1b1b1b] text-white border border-gray-600 rounded-lg px-4 py-3"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#902f3c] text-white px-6 py-2 rounded-lg hover:bg-[#7e2632] transition w-full"
                >
                  {showCreateForm ? 'Submit' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    resetForm();
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goods.map((g) => (
            <div
              key={g._id}
              className="bg-[#1b1b1b] border border-gray-700 p-6 rounded-xl text-white shadow-md"
            >
              <h2 className="text-2xl font-bold mb-1">{g.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{g.description}</p>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() =>
                    toggleStatus(g._id, g.status === 'active' ? 'inactive' : 'active')
                  }
                  className={`text-xs px-3 py-1 rounded-full ${
                    g.status === 'active' ? 'bg-green-600' : 'bg-yellow-500 text-black'
                  }`}
                >
                  {g.status}
                </button>
                <button
                  onClick={() => openEditForm(g)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-full transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(g._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1 rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}