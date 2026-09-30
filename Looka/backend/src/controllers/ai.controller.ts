/**
 * @file ai.controller.ts
 * @description Controlador HTTP de las funciones de generación asistida.
 * Valida la entrada y delega la creación de muebles al servicio de IA.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

/**
 * Genera un mueble a partir de una descripción enviada por el usuario.
 * @param req Solicitud con `prompt` en el cuerpo y `userId` autenticado.
 * @param res Respuesta HTTP con el recurso generado o un mensaje de error.
 * @returns Respuesta HTTP con estado 201, 400 o 500.
 */
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