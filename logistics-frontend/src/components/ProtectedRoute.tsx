'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        router.push('/login');
      } else if (adminOnly && user.role !== 'admin') {
        // Trying to access admin-only page but not admin
        router.push('/');
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-[#902f3c] font-bold text-xl">
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}
