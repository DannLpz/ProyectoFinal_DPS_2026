/**
 * @file listing.routes.ts
 * @description Configura los endpoints de consulta y administración de publicaciones.
 * Las operaciones personales y de escritura están protegidas por autenticación.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Router } from 'express';
import * as listingController from '../controllers/listing.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/** Devuelve el catálogo público de publicaciones. */
router.get('/', listingController.getAll);
/** Devuelve las publicaciones de la cuenta autenticada. */
router.get('/mine', authMiddleware, listingController.getMine);
/** Crea una publicación para la cuenta autenticada. */
router.post('/', authMiddleware, listingController.create);
/** Elimina una publicación propia por identificador. */
router.delete('/:id', authMiddleware, listingController.remove);

/** Router Express de publicaciones. */
export default router;