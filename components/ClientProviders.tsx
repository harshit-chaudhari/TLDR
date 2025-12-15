'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </FavoritesProvider>
    </AuthProvider>
  );
}
