/**
 * @file useCartStore.ts
 * @description Mantiene el contenido y las acciones del carrito de compras.
 * Permite a distintas pantallas acceder a una selección compartida de muebles.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { create } from 'zustand';
import type { Listing } from '../models/Listing';

/** Artículos y operaciones disponibles para administrar el carrito. */
interface CartState {
  items: Listing[];
  /** Agrega una publicación al carrito si todavía no está incluida. */
  addItem: (listing: Listing) => void;
  /** Retira del carrito la publicación identificada. */
  removeItem: (id: string) => void;
  /** Vacía por completo el contenido del carrito. */
  clear: () => void;
  /** Indica si una publicación ya está en el carrito. */
  isInCart: (id: string) => boolean;
  /** Calcula el importe acumulado de las publicaciones actuales. */
  getTotal: () => number;
}

/**
 * Hook de Zustand para consultar y actualizar el carrito.
 * @returns Estado del carrito completo o el valor seleccionado por el consumidor.
 */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (listing) =>
    set((state) => {
      if (state.items.some((i) => i.id === listing.id)) return state;
      return { items: [...state.items, listing] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clear: () => set({ items: [] }),

  isInCart: (id) => get().items.some((i) => i.id === id),

  getTotal: () =>
    get().items.reduce((sum, item) => sum + (item.price || 0), 0),
}));