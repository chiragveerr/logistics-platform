'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user profile on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/profile', {
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok) {
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
  }, []);

  // 🧠 Secure and Clean Logout
  const logout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/logout', {
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
