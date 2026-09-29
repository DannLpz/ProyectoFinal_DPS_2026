import { apiClient } from './apiClient';
import type { Furniture } from '../models/Furniture';

export const AIService = {
  /**
   * Inicia la generación de un mueble.
   * Devuelve un jobId inmediatamente para hacer polling del progreso.
   */
  async generateFurniture(prompt: string): Promise<{ jobId: string }> {
    const response = await apiClient.post(
      '/ai/generate',
      { prompt },
      { timeout: 600000 } // 10 minutos
    );
    return response.data;
  },

  /**
   * Consulta el progreso de una generación.
   */
  async getProgress(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'done' | 'error';
    progress: number;
    message: string;
    furniture?: Furniture;
  }> {
    const response = await apiClient.get(`/ai/progress/${jobId}`, {
      timeout: 15000,
    });
    return response.data;
  },
};