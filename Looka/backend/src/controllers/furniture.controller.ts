/**
 * @file furniture.controller.ts
 * @description Controlador HTTP del catálogo de muebles.
 * Expone elementos predeterminados y los generados para la cuenta autenticada.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Request, Response } from 'express';
import * as furnitureService from '../services/furniture.service';

/**
 * Devuelve el catálogo de muebles predeterminados.
 * @param req Solicitud HTTP entrante.
 * @param res Respuesta HTTP donde se entrega la colección.
 * @returns Respuesta HTTP con la lista de muebles.
 */
export async function getDefault(req: Request, res: Response) {
  const items = await furnitureService.getDefaultFurniture();
  res.json(items);
}

/**
 * Devuelve los muebles generados que pertenecen al usuario autenticado.
 * @param req Solicitud con el identificador de usuario establecido por autenticación.
 * @param res Respuesta HTTP donde se entrega la colección.
 * @returns Respuesta HTTP con los muebles del usuario.
 */
export async function getGenerated(req: Request, res: Response) {
  const userId = (req as any).userId;
  const items = await furnitureService.getGeneratedFurniture(userId);
  res.json(items);
}