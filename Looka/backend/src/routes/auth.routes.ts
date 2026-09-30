/**
 * @file auth.routes.ts
 * @description Registra los endpoints públicos de autenticación.
 * Conecta las rutas de registro e inicio de sesión con sus controladores.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/** Crea una cuenta a partir de las credenciales recibidas. */
router.post('/register', authController.register);
/** Inicia una sesión con identificador y contraseña. */
router.post('/login', authController.login);

/** Router Express de autenticación. */
export default router;