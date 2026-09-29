import { apiClient } from './apiClient';
import type { Furniture } from '../models/Furniture';

export const FurnitureService = {
  async getDefaultFurniture(): Promise<Furniture[]> {
    const response = await apiClient.get('/furniture/default');
    return response.data;
  },

  async getGeneratedFurniture(): Promise<Furniture[]> {
    const response = await apiClient.get('/furniture/generated');
    return response.data;
  },
};