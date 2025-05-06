'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import safeFetch from '@/utils/safeFetch';

export default function SupportPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [formData, setFormData] = useState({ phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔐 Fetch user using safeFetch
  useEffect(() => {
    const fetchUser = async () => {
      const data = await safeFetch('http://localhost:8000/api/users/profile', {
        credentials: 'include',
      });

      if (!data?.user) {
        toast.error('Please login to access support');
        router.push('/login');
      } else {
        setUser({ name: data.user.name, email: data.user.email });
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // 📝 Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📬 Submit support message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      name: user?.name,
      email: user?.email,
    };

    const result = await safeFetch('http://localhost:8000/api/contact', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (result?.success) {
      toast.success('Message sent successfully 🚀');
      setFormData({ phone: '', subject: '', message: '' });
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-xl text-white">
      <h1 className="text-3xl font-semibold mb-4">Need Help? 🤝</h1>
      <p className="text-zinc-400 mb-8">Fill out the form below and our support team will get back to you.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-800 p-6 rounded-xl shadow-lg">
        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Message</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
