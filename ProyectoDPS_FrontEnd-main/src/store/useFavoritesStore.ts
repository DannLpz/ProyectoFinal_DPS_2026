import { create } from 'zustand';
import type { Furniture } from '../models/Furniture';

interface FavoritesState {
  favorites: Furniture[];
  toggleFavorite: (item: Furniture) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  toggleFavorite: (item) =>
    set((state) => {
      const exists = state.favorites.some((f) => f.id === item.id);
      return {
        favorites: exists
          ? state.favorites.filter((f) => f.id !== item.id)
          : [...state.favorites, item],
      };
    }),

  isFavorite: (id) => get().favorites.some((f) => f.id === id),

  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== id),
    })),

  clear: () => set({ favorites: [] }),
}));