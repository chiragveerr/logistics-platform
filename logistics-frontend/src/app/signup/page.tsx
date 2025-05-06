'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import safeFetch from '@/utils/safeFetch';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill in all fields.');
    }

    if (!form.email.includes('@') || form.password.length < 6) {
      return toast.error('Enter a valid email and password (min 6 chars).');
    }

    setLoading(true);

    const res = await safeFetch('http://localhost:8000/api/users/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res && res.user) {
      toast.success('Signup successful!');
      setTimeout(() => {
        const role = res.user.role === 'admin' ? 'admin' : 'user';
        router.push(`/${role}/dashboard`);
      }, 1200);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-[#fdf2f3] text-[#902f3c] font-sans">
      <ToastContainer />

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#902f3c] to-[#a74455] justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center px-12"
        >
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Join LogistiX</h1>
          <p className="text-lg text-white/80">Create your account and manage global shipments with ease.</p>
        </motion.div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold mb-2 text-[#902f3c]">Create your account</h2>
          <p className="text-gray-600 text-sm">Sign up to access the full dashboard</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#902f3c]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#902f3c]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-[#902f3c]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#902f3c] hover:text-[#a74455]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#902f3c] hover:bg-[#a74455] text-white py-3 rounded-md font-bold transition-all"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-[#902f3c] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
