/**
 * @file auth.controller.ts
 * @description Adaptador HTTP para registro e inicio de sesión.
 * Traduce las solicitudes de autenticación en respuestas para el cliente.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * Registra una cuenta con los datos recibidos en el cuerpo de la solicitud.
 * @param req Solicitud HTTP que contiene los datos de registro.
 * @param res Respuesta HTTP con la cuenta creada o el error de validación.
 * @returns Respuesta HTTP con estado 201 o 400.
 */
export async function register(req: Request, res: Response) {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Autentica al usuario con su identificador y contraseña.
 * @param req Solicitud HTTP con `identifier` y `password`.
 * @param res Respuesta HTTP con sesión, rechazo de credenciales o error.
 * @returns Respuesta HTTP con estado 200, 401 o 500.
 */
export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;
    const result = await authService.loginUser(identifier, password);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}