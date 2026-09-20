import { apiClient } from './apiClient';
import type { Furniture } from '../models/Furniture';

export const AIService = {
  async generateFurniture(prompt: string): Promise<Furniture> {
    const response = await apiClient.post(
      '/ai/generate',
      { prompt },
      { timeout: 300000 }
    );
    return response.data;
  },
};