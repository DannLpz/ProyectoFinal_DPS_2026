import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

export async function generate(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    const userId = (req as any).userId;

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ message: 'El prompt es demasiado corto' });
    }

    const generated = await aiService.generateFurnitureFromPrompt(prompt, userId);
    res.status(201).json(generated);
  } catch (error: any) {
    console.error('Error generando mueble:', error);
    res.status(500).json({ message: error.message || 'Error generando el mueble' });
  }
}