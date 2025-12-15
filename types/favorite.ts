export interface Favorite {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  addedAt: Date;
}

export interface FavoriteInput {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
}

export interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  isFavorited: (tmdbId: number, mediaType: 'movie' | 'tv') => boolean;
  addFavorite: (favorite: FavoriteInput) => Promise<void>;
  removeFavorite: (tmdbId: number, mediaType: 'movie' | 'tv') => Promise<void>;
  toggleFavorite: (favorite: FavoriteInput) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}
