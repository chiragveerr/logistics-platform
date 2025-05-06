'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: string;
}

function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await safeFetch('http://localhost:8000/api/users/profile', {
        credentials: 'include',
      });

      if (!data?.user) {
        toast.error('Failed to load profile');
        setError('Unable to load your profile.');
      } else {
        setProfile(data.user);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);

    const data = await safeFetch('http://localhost:8000/api/users/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (data?.user) {
      toast.success('Profile updated successfully');
    } else {
      toast.error('Failed to update profile');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center text-white text-lg">
        <span className="animate-pulse">Loading your profile...</span>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#ffcc00]">Your Profile</h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">Update your personal and company info.</p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md text-center font-semibold mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5 bg-[#111111] p-6 rounded-2xl border border-gray-700 shadow-xl">
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Full Name"
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
        />
        <input
          type="email"
          value={profile.email}
          disabled
          className="p-3 rounded-md bg-[#1b1b1b] text-gray-400 border border-gray-700 cursor-not-allowed"
        />
        <input
          type="text"
          value={profile.phone || ''}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="Phone Number"
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
        />
        <input
          type="text"
          value={profile.companyName || ''}
          onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
          placeholder="Company Name"
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
        />
        <textarea
          rows={3}
          value={profile.address || ''}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          placeholder="Address"
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
        />

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-[#902f3c] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </section>
  );
}

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
