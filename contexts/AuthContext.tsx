'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo/testing purposes
const DEMO_USER = {
  id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@tldr.com',
  image: null,
  username: null,
  profilePicture: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<typeof DEMO_USER | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tldr_demo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    // Simulate sign-in delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create demo user with current timestamp for uniqueness
    const newUser = {
      ...DEMO_USER,
      id: `demo-user-${Date.now()}`,
    };

    setUser(newUser);
    localStorage.setItem('tldr_demo_user', JSON.stringify(newUser));
    toast.success('Signed in successfully!');
  };

  const signOut = async () => {
    // Simulate sign-out delay
    await new Promise(resolve => setTimeout(resolve, 300));

    setUser(null);
    localStorage.removeItem('tldr_demo_user');
    localStorage.removeItem('tldr_favorites');
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user ? { user, expires: '' } : null,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
