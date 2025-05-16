'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface LocationType {
  _id: string;
  name: string;
  status: string;
  type: string;
}

interface GoodsType {
  _id: string;
  name: string;
  status: string;
}

interface ContainerType {
  _id: string;
  name: string;
  status: string;
}

export default function CreateQuotePage() {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pickupLocations, setPickupLocations] = useState<LocationType[]>([]);
  const [dropLocations, setDropLocations] = useState<LocationType[]>([]);
  const [goodsTypes, setGoodsTypes] = useState<GoodsType[]>([]);
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([]);

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [customGoodsName, setCustomGoodsName] = useState('');
  const [containerType, setContainerType] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', weight: '' });
  const [paymentTerm, setPaymentTerm] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActiveData = async () => {
      const locData = await safeFetch(`${BASE}/api/locations`);
      const goodsData = await safeFetch(`${BASE}/api/goods`);
      const containerData = await safeFetch(`${BASE}/api/containers`);

      if (locData?.locations) {
        const pickup = locData.locations.filter(
          (loc: LocationType) => loc.status === 'active' && loc.type === 'pickup'
        );
        const drop = locData.locations.filter(
          (loc: LocationType) => loc.status === 'active' && loc.type === 'drop-off'
        );
        setPickupLocations(pickup);
        setDropLocations(drop);
      }
      if (goodsData?.types) {
        const activeGoods = goodsData.types.filter((g: GoodsType) => g.status === 'active');
        setGoodsTypes(activeGoods);
      }
      if (containerData?.types) {
        const activeContainers = containerData.types.filter((c: ContainerType) => c.status === 'active');
        setContainerTypes(activeContainers);
      }
    };

    fetchActiveData();
  }, [BASE]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalGoodsType = goodsType === 'custom' ? customGoodsName.trim() : goodsType;

    if (!pickupLocation || !dropLocation || !finalGoodsType || !containerType || !paymentTerm) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);

    const payload = {
      pickupLocation,
      dropLocation,
      goodsType: finalGoodsType,
      containerType,
      paymentTerm,
      additionalNotes,
      dimensions: {
        length: Number(dimensions.length),
        width: Number(dimensions.width),
        height: Number(dimensions.height),
        weight: Number(dimensions.weight),
      },
    };

    const res = await safeFetch(`${BASE}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    }, {debounce: true});

    if (res?.quote) {
      toast.success('✅ Quote submitted successfully!');
      resetForm();
    }

    setLoading(false);
  };

  const resetForm = () => {
    setPickupLocation('');
    setDropLocation('');
    setGoodsType('');
    setCustomGoodsName('');
    setContainerType('');
    setDimensions({ length: '', width: '', height: '', weight: '' });
    setPaymentTerm('');
    setAdditionalNotes('');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h1 className="text-4xl font-extrabold text-[#902f3c] mb-6 tracking-tight text-center">
          Request a Shipping Quote
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">Select Pickup Location</option>
            {pickupLocations.map((loc) => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>

          <select value={dropLocation} onChange={(e) => setDropLocation(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">Select Drop Location</option>
            {dropLocations.map((loc) => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>

          <select value={goodsType} onChange={(e) => setGoodsType(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">Select Goods Type</option>
            {goodsTypes.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
            <option value="custom">Other (Specify)</option>
          </select>

          {goodsType === 'custom' && (
            <input
              type="text"
              value={customGoodsName}
              onChange={(e) => setCustomGoodsName(e.target.value)}
              placeholder="Enter custom goods type"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              required
            />
          )}

          <select value={containerType} onChange={(e) => setContainerType(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">Select Container Type</option>
            {containerTypes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['length', 'width', 'height', 'weight'].map((dim) => (
              <input
                key={dim}
                type="number"
                placeholder={`${dim[0].toUpperCase() + dim.slice(1)} (${dim === 'weight' ? 'kg' : 'm'})`}
                value={dimensions[dim as keyof typeof dimensions]}
                onChange={(e) => setDimensions({ ...dimensions, [dim]: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-4 py-3"
              />
            ))}
          </div>

          <select value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">Select Payment Term</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
            <option value="Third Party">Third Party</option>
          </select>

          <textarea
            placeholder="Additional Notes (optional)"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
            rows={4}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#902f3c] hover:bg-[#7e2632] text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
