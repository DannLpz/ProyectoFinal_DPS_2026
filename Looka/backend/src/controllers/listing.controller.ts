import { Request, Response } from 'express';
import * as listingService from '../services/listing.service';

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { title, description, price, furnitureId, currency } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'El título es muy corto' });
    }
    if (!description || description.trim().length < 5) {
      return res.status(400).json({ message: 'La descripción es muy corta' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }
    if (!furnitureId) {
      return res.status(400).json({ message: 'Debes seleccionar un mueble' });
    }

    const listing = await listingService.createListing(
      { title, description, price, furnitureId, currency },
      userId
    );

    res.status(201).json(listing);
  } catch (error: any) {
    console.error('Error creando publicación:', error);
    res.status(400).json({ message: error.message || 'Error creando publicación' });
  }
}

export async function getMine(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const listings = await listingService.getUserListings(userId);
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const listings = await listingService.getAllListings();
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = String(req.params.id); 
    await listingService.deleteListing(id, userId);
    res.json({ message: 'Publicación eliminada' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}