/**
 * Categorías de muebles soportadas por la aplicación.
 * Coinciden con las categorías que Gemini puede devolver.
 */
/**
 * @file Furniture.ts
 * @description Define los tipos de categoría, origen y datos de un mueble.
 * Sirve como contrato compartido para catálogo, generación y publicaciones.
 * @author Equipo LOOka
 * @version 2.0.0
 */

/** Categorías de muebles reconocidas por el catálogo y la generación de IA. */
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
/** Origen del registro de mueble dentro de la aplicación. */
export type FurnitureSource = 'default' | 'ai-generated';

/** Representación de un mueble disponible en el catálogo de LOOka. */
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