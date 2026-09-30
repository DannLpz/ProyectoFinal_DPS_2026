/**
 * @file auth.middleware.ts
 * @description Middleware de autenticación JWT.
 *
 * Verifica que cada petición a endpoints protegidos incluya
 * un token JWT válido en el header `Authorization: Bearer <token>`.
 * Si el token es válido, inyecta el `userId` decodificado en
 * el objeto `req` para que los controladores lo usen.
 *
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Middleware que valida el token JWT de la petición.
 *
 * @param req Objeto de petición de Express.
 * @param res Objeto de respuesta de Express.
 * @param next Callback para continuar al siguiente middleware.
 * @returns Llama a `next()` si el token es válido o responde con estado 401.
 *
 * @example
 * router.get('/protected', authMiddleware, controller.action);
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Verificar que exista el header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar y decodificar el token con la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    // Inyectar el userId decodificado en el objeto req
    (req as any).userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}