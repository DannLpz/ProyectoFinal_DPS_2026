/**
 * @file useCatalogStore.ts
 * @description Mantiene en memoria el catálogo y su estado de carga.
 * Comparte los resultados de consulta entre las pantallas que consumen muebles.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { create } from 'zustand';
import type { Furniture } from '../models/Furniture';

/** Datos del catálogo y acciones para cargar o reemplazar sus elementos. */
interface CatalogState {
  defaultFurniture: Furniture[];
  generatedFurniture: Furniture[];
  /** Reemplaza la colección de muebles predeterminados. */
  setDefaultFurniture: (items: Furniture[]) => void;
  /** Reemplaza la colección de muebles generados del usuario. */
  setGeneratedFurniture: (items: Furniture[]) => void;
  /** Añade un mueble generado al inicio de la colección. */
  addGeneratedFurniture: (item: Furniture) => void;
  /** Elimina todos los muebles generados mantenidos localmente. */
  clearGeneratedFurniture: () => void;
}

/**
 * Hook de Zustand para acceder al catálogo y sus operaciones.
 * @returns Estado del catálogo completo o el valor seleccionado por el consumidor.
 */
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