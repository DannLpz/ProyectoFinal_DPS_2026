/**
 * @file furniture.routes.ts
 * @description Registra las rutas de consulta del catálogo de muebles.
 * La colección generada requiere que la solicitud incluya autenticación.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Router } from 'express';
import * as furnitureController from '../controllers/furniture.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/** Consulta el catálogo predeterminado. */
router.get('/default', furnitureController.getDefault);
/** Consulta los muebles generados por la cuenta autenticada. */
router.get('/generated', authMiddleware, furnitureController.getGenerated);

/** Router Express del catálogo de muebles. */
export default router;