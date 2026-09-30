/**
 * @file useFavoritesStore.ts
 * @description Mantiene la colección de muebles favoritos del usuario.
 * Centraliza las acciones para agregar, retirar y consultar elementos guardados.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { create } from 'zustand';
import type { Furniture } from '../models/Furniture';

/** Colección de favoritos y acciones para modificarla. */
interface FavoritesState {
  favorites: Furniture[];
  /** Alterna la presencia de un mueble en la colección. */
  toggleFavorite: (item: Furniture) => void;
  /** Indica si un mueble está guardado como favorito. */
  isFavorite: (id: string) => boolean;
  /** Retira un mueble identificado por su id de la colección. */
  removeFavorite: (id: string) => void;
  /** Vacía la colección de favoritos. */
  clear: () => void;
}

/**
 * Hook de Zustand para consultar y modificar los favoritos.
 * @returns Estado de favoritos completo o el valor seleccionado por el consumidor.
 */
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