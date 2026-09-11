import { Request, Response } from 'express';
import * as furnitureService from '../services/furniture.service';

export async function getDefault(req: Request, res: Response) {
  const items = await furnitureService.getDefaultFurniture();
  res.json(items);
}

export async function getGenerated(req: Request, res: Response) {
  const userId = (req as any).userId;
  const items = await furnitureService.getGeneratedFurniture(userId);
  res.json(items);
}