'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import safeFetch from '@/utils/safeFetch';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

function SupportMessagesContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Throttle fetchMessages to prevent spamming
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        const data = await safeFetch<{ messages: Message[] }>(
          `${BASE}/api/contact`,
          
        );
        setMessages(data?.messages || []);
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Error fetching messages:', error.message);
        toast.error('Failed to load messages');
        setError('Unable to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Throttle delete to prevent rapid delete clicks
  const handleDeleteMessage = async (id: string) => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      await safeFetch(
        `${BASE}/api/contact/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
        { throttle: true }
      );

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success('Message deleted');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error deleting message:', error.message);
      toast.error('Failed to delete message');
    }
  };

  // Debounce status update to prevent rapid toggling
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      await safeFetch(
        `${BASE}/api/contact/${id}/status`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
        { debounce: true }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, status: newStatus } : msg
        )
      );

      toast.success('Status updated');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error updating message status:', error.message);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <section className="p-10 flex justify-center items-center h-[50vh]">
        <div className="text-xl font-semibold animate-pulse text-white">Loading messages...</div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10">
      {/* Page Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffcc00]">
          Manage Contact Messages
        </h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">
          View, update, and manage all customer inquiries.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-6 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Messages Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-700 bg-[#111111]">
        {messages.length === 0 ? (
          <div className="p-10 text-center text-white italic">No messages found.</div>
        ) : (
          <table className="min-w-[900px] w-full text-sm sm:text-base divide-y divide-gray-700">
            <thead className="bg-[#1b1b1b]">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-white uppercase">Name</th>
                <th className="px-4 py-3 text-left font-bold text-white uppercase">Email</th>
                <th className="px-4 py-3 text-left font-bold text-white uppercase">Subject</th>
                <th className="px-4 py-3 text-left font-bold text-white uppercase">Message</th>
                <th className="px-4 py-3 text-center font-bold text-white uppercase">Status</th>
                <th className="px-4 py-3 text-center font-bold text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#111111] divide-y divide-gray-700">
              {messages.map((msg) => (
                <motion.tr
                  key={msg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td className="px-4 py-3 text-white">{msg.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-white">{msg.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-white">{msg.subject || 'N/A'}</td>
                  <td className="px-4 py-3 text-white">{msg.message || 'No message'}</td>
                  <td className="px-4 py-3 text-center text-white capitalize">
                    <select
                      value={msg.status}
                      onChange={(e) => handleUpdateStatus(msg._id, e.target.value)}
                      className="bg-[#902f3c] text-white dark:bg-[#ffcc00] dark:text-black px-3 py-2 rounded-lg focus:outline-none"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="bg-red-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default function AdminSupportPage() {
  return (
    <ProtectedRoute adminOnly>
      <SupportMessagesContent />
    </ProtectedRoute>
  );
}