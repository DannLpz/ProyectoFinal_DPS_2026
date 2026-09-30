/**
 * @file ListingService.ts
 * @description Encapsula las operaciones HTTP de publicaciones del marketplace.
 * Define el contrato de creación y ofrece consulta y eliminación de listados.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { apiClient } from './apiClient';
import type { Listing } from '../models/Listing';

/** Campos que el cliente debe proporcionar para crear una publicación. */
export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  furnitureId: string;
}

/** Operaciones de lectura y escritura de publicaciones para el cliente. */
export const ListingService = {
  /**
   * Crea una publicación con los datos comerciales proporcionados.
   * @param data Datos requeridos para asociar precio, descripción y mueble.
   * @returns Publicación creada por el backend.
   * @throws Error si la API rechaza los datos o falla la solicitud.
   */
  async create(data: CreateListingInput): Promise<Listing> {
    const response = await apiClient.post('/listings', data);
    return response.data;
  },

  /**
   * Recupera las publicaciones pertenecientes a la sesión actual.
   * @returns Publicaciones del usuario autenticado.
   * @throws Error si falla la solicitud o la autenticación.
   */
  async getMine(): Promise<Listing[]> {
    const response = await apiClient.get('/listings/mine');
    return response.data;
  },

  /**
   * Recupera las publicaciones públicas del marketplace.
   * @returns Colección de publicaciones disponibles.
   * @throws Error si falla la solicitud HTTP.
   */
  async getAll(): Promise<Listing[]> {
    const response = await apiClient.get('/listings');
    return response.data;
  },

  /**
   * Elimina una publicación por su identificador.
   * @param id Identificador del listado que se eliminará.
   * @returns Promesa sin valor cuando finaliza la eliminación.
   * @throws Error si la API rechaza la operación o falla la solicitud.
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/listings/${id}`);
  },
};