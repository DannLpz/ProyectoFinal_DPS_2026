/**
 * @file AIService.ts
 * @description Servicio de comunicación con el backend para generación de muebles con IA.
 *
 * Envía el prompt del usuario al endpoint /api/ai/generate y espera
 * el modelo 3D generado. Timeout extendido a 10 minutos porque el
 * pipeline Gemini + Tripo3D puede tardar hasta 2.5 minutos.
 *
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { apiClient } from './apiClient';
import type { Furniture } from '../models/Furniture';

export const AIService = {
  /**
   * Envía un prompt al backend y devuelve el mueble generado.
   *
   * @param {string} prompt - Descripción del mueble en lenguaje natural
   * @returns {Promise<Furniture>} El mueble generado con todos sus datos
   * @throws {Error} Si el backend responde con error o se agota el timeout
   *
   * @example
   * const furniture = await AIService.generateFurniture("una mesa de madera");
   */
  async generateFurniture(prompt: string): Promise<Furniture> {
    const response = await apiClient.post(
      '/ai/generate',
      { prompt },
      { timeout: 600000 } // 10 minutos
    );
    return response.data;
  },
};