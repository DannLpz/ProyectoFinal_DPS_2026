import type { Furniture } from './Furniture';

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