'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Favorite, FavoriteInput, FavoritesContextType } from '@/types/favorite';
import toast from 'react-hot-toast';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      // Load from localStorage for demo mode
      const cached = localStorage.getItem('tldr_favorites');
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setFavorites(data);
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load favorites when user signs in
  useEffect(() => {
    if (user) {
      // Try to load from cache first for instant display
      const cached = localStorage.getItem('tldr_favorites');
      if (cached) {
        try {
          setFavorites(JSON.parse(cached));
        } catch (e) {
          // Invalid cache, ignore
        }
      }

      // Then refresh from server
      refreshFavorites();
    } else {
      setFavorites([]);
      localStorage.removeItem('tldr_favorites');
    }
  }, [user, refreshFavorites]);

  const isFavorited = useCallback((tmdbId: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(fav => fav.tmdbId === tmdbId && fav.mediaType === mediaType);
  }, [favorites]);

  const addFavorite = async (favorite: FavoriteInput) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    // Create new favorite
    const newFavorite: Favorite = {
      id: 'fav-' + Date.now(),
      userId: user.id,
      ...favorite,
      addedAt: new Date(),
    };

    const updatedFavorites = [newFavorite, ...favorites];
    setFavorites(updatedFavorites);

    // Save to localStorage
    localStorage.setItem('tldr_favorites', JSON.stringify(updatedFavorites));
    toast.success('Added to favorites');
  };

  const removeFavorite = async (tmdbId: number, mediaType: 'movie' | 'tv') => {
    if (!user) return;

    const favoriteToRemove = favorites.find(f => f.tmdbId === tmdbId && f.mediaType === mediaType);
    if (!favoriteToRemove) return;

    // Remove favorite
    const updatedFavorites = favorites.filter(f => f.id !== favoriteToRemove.id);
    setFavorites(updatedFavorites);

    // Save to localStorage
    localStorage.setItem('tldr_favorites', JSON.stringify(updatedFavorites));
    toast.success('Removed from favorites');
  };

  const toggleFavorite = async (favorite: FavoriteInput) => {
    if (isFavorited(favorite.tmdbId, favorite.mediaType)) {
      await removeFavorite(favorite.tmdbId, favorite.mediaType);
    } else {
      await addFavorite(favorite);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorited,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
