import { create } from 'zustand';
import type { Furniture } from '../models/Furniture';

interface CatalogState {
  defaultFurniture: Furniture[];
  generatedFurniture: Furniture[];
  setDefaultFurniture: (items: Furniture[]) => void;
  setGeneratedFurniture: (items: Furniture[]) => void;
  addGeneratedFurniture: (item: Furniture) => void;
  clearGeneratedFurniture: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  defaultFurniture: [],
  generatedFurniture: [],
  setDefaultFurniture: (items) => set({ defaultFurniture: items }),
  setGeneratedFurniture: (items) => set({ generatedFurniture: items }),
  addGeneratedFurniture: (item) =>
    set((state) => ({
      // Lo agregamos al inicio para que aparezca primero
      generatedFurniture: [item, ...state.generatedFurniture],
    })),
  clearGeneratedFurniture: () => set({ generatedFurniture: [] }),
}));