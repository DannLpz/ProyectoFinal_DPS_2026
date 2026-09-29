import type { User } from './User';

export interface AuthCredentials {
  identifier: string;
  password: string;
}

// Ahora el caso exitoso incluye el token que nos da el backend
export type AuthResult =
  | { success: true; user: User; token: string }
  | { success: false; message: string };