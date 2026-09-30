/**
 * @file Listing.ts
 * @description Define el modelo de una publicación del marketplace.
 * Relaciona el contenido comercial con el mueble anunciado.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import type { Furniture } from './Furniture';

/** Datos de una publicación visible en el catálogo del marketplace. */
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  createdAt: string;
  furnitureId: string;
  furniture: Furniture;
  sellerId: string;
  seller?: {
    id: string;
    username: string;
    displayName: string;
  };
}