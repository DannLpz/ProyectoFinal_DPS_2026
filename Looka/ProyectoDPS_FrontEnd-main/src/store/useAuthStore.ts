/**
 * @file useAuthStore.ts
 * @description Mantiene el estado global de autenticación de la aplicación.
 * Expone la sesión activa y las acciones asociadas a su ciclo de vida.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { create } from 'zustand';
import { User } from '../models/User';

/** Estado de sesión y operaciones disponibles para los consumidores del store. */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Guarda el perfil y token de una sesión iniciada correctamente. */
  login: (user: User, token: string) => void;
  /** Limpia el perfil y las credenciales de la sesión activa. */
  logout: () => void;
}

/**
 * Hook de Zustand para consultar y modificar la sesión del usuario.
 * @returns Estado de autenticación completo o el valor seleccionado por el consumidor.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));