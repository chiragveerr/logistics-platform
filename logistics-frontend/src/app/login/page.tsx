"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import safeFetch from "@/utils/safeFetch";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: string;
  role: "customer" | "admin";
  createdAt?: string;
  updatedAt?: string;
};

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields.");
    }

    setLoading(true);
    const data = await safeFetch<{ user: UserType }>(
      `${BASE}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      },
      { debounce: true } // <-- Debounce added here
    );

    setLoading(false);
    if (!data?.user) return;

    setUser({
      ...data.user,
      id:data.user._id
    });
    toast.success(`Welcome, ${data.user.name}!`);

    const redirect =
      data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    router.push(redirect);
  };

  return (
    <main className="min-h-screen flex bg-[#fdf2f3] text-[#902f3c] font-sans">
      <ToastContainer />

      {/* Left Branding Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#902f3c] to-[#a74455] justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center px-12"
        >
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-white/80">
            Login to manage your shipments and track your logistics in
            real-time.
          </p>
        </motion.div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold mb-2 text-[#902f3c]">
            Login to your account
          </h2>
          <p className="text-gray-600 text-sm">
            Access your dashboard and shipments
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#902f3c]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#902f3c]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#902f3c]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#902f3c] hover:bg-[#a74455] text-white py-3 rounded-md font-bold transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#902f3c] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
