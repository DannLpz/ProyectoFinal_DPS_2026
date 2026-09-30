/**
 * @file FurnitureService.ts
 * @description Encapsula las consultas del frontend al catálogo de muebles.
 * Separa los recursos predeterminados de los generados para la cuenta autenticada.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { apiClient } from './apiClient';
import type { Furniture } from '../models/Furniture';

/** Operaciones de consulta disponibles para el catálogo de muebles. */
export const FurnitureService = {
  /**
   * Recupera los muebles predeterminados del backend.
   * @returns Lista de muebles predeterminados.
   * @throws Error si falla la solicitud HTTP.
   */
  async getDefaultFurniture(): Promise<Furniture[]> {
    const response = await apiClient.get('/furniture/default');
    return response.data;
  },

  /**
   * Recupera los muebles generados asociados a la sesión activa.
   * @returns Lista de muebles generados para el usuario autenticado.
   * @throws Error si falla la solicitud HTTP o la autenticación.
   */
  async getGeneratedFurniture(): Promise<Furniture[]> {
    const response = await apiClient.get('/furniture/generated');
    return response.data;
  },
};