/**
 * Categorías de muebles soportadas por la aplicación.
 * Coinciden con las categorías que Gemini puede devolver.
 */
export type FurnitureCategory =
  | 'silla'
  | 'mesa'
  | 'sofa'
  | 'cama'
  | 'ropero'
  | 'estante'
  | 'escritorio'
  | 'television'
  | 'organizador'
  | 'zapatero'
  | 'otro';

/**
 * Origen del mueble:
 *  - `default`: viene del catálogo inicial
 *  - `ai-generated`: creado por el usuario mediante IA
 */
export type FurnitureSource = 'default' | 'ai-generated';

export interface Furniture {
  id: string;
  name: string;
  description: string;
  category: FurnitureCategory;
  modelUrl: string;
  thumbnailUrl: string;
  source: FurnitureSource;
  prompt?: string;
}