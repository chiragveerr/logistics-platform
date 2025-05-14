'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define a User type (customize fields as needed)
interface User {
  id: string;
  name?: string;
  email?: string;
  // Add other user properties here
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 🧠 Fetch user profile on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE}/api/users/profile`, {
          credentials: 'include',
        });
        const data = (await res.json()) as { user?: User };

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Fetch user error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [BASE]);

  // 🧠 Secure and Clean Logout
  const logout = async () => {
    try {
      const res = await fetch(`${BASE}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null); // 🛡️ Clear the frontend user immediately
        localStorage.clear(); // 🛡️ Clear browser storage (future proof)
        sessionStorage.clear();
        window.location.reload(); // 🛡️ Force full app memory reload (not router push)
      } else {
        console.error('Failed to logout.');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
