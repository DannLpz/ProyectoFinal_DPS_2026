/**
 * @file ai.routes.ts
 * @description Define las rutas HTTP de generación de muebles con IA.
 * Protege el endpoint de generación mediante autenticación JWT.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/** Endpoint autenticado para generar un mueble desde un prompt. */
router.post('/generate', authMiddleware, aiController.generate);

/** Router Express de las operaciones de IA. */
export default router;