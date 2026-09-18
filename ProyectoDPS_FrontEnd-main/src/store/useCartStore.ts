import { create } from 'zustand';
import type { Listing } from '../models/Listing';

interface CartState {
  items: Listing[];
  addItem: (listing: Listing) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isInCart: (id: string) => boolean;
  getTotal: () => number;
}

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