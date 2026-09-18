import { apiClient } from './apiClient';
import type { Listing } from '../models/Listing';

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  furnitureId: string;
}

export const ListingService = {
  async create(data: CreateListingInput): Promise<Listing> {
    const response = await apiClient.post('/listings', data);
    return response.data;
  },

  async getMine(): Promise<Listing[]> {
    const response = await apiClient.get('/listings/mine');
    return response.data;
  },

  async getAll(): Promise<Listing[]> {
    const response = await apiClient.get('/listings');
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/listings/${id}`);
  },
};