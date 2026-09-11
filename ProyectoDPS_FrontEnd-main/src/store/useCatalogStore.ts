import { create } from 'zustand';
import { Furniture } from '../models/Furniture';

interface CatalogState {
  defaultFurniture: Furniture[];
  generatedFurniture: Furniture[];
  setDefaultFurniture: (items: Furniture[]) => void;
  addGeneratedFurniture: (item: Furniture) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  defaultFurniture: [],
  generatedFurniture: [],
  setDefaultFurniture: (items) => set({ defaultFurniture: items }),
  addGeneratedFurniture: (item) => set((state) => ({ generatedFurniture: [...state.generatedFurniture, item] })),
}));