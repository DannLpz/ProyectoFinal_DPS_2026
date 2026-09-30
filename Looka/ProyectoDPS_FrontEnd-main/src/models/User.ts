/**
 * @file User.ts
 * @description Define los roles y el perfil de usuario utilizados por el cliente.
 * El modelo representa únicamente los datos públicos necesarios para la interfaz.
 * @author Equipo LOOka
 * @version 2.0.0
 */

/** Roles de usuario reconocidos por el producto. */
export type UserRole = 'buyer' | 'seller';

/** Perfil de usuario expuesto a las pantallas del cliente. */
export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
}
