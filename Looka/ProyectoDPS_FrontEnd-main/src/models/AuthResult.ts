/**
 * @file AuthResult.ts
 * @description Define credenciales y resultados del flujo de autenticación.
 * Usa el modelo de usuario compartido por la sesión de la aplicación.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import type { User } from './User';

/** Credenciales usadas para iniciar sesión en el servicio de autenticación. */
export interface AuthCredentials {
  identifier: string;
  password: string;
}

// Ahora el caso exitoso incluye el token que nos da el backend
/** Resultado exitoso de autenticación o rechazo con su mensaje asociado. */
export type AuthResult =
  | { success: true; user: User; token: string }
  | { success: false; message: string };