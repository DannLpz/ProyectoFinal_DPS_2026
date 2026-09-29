import axios from 'axios';
import { apiClient } from './apiClient';
import type { AuthCredentials, AuthResult } from '../models/AuthResult';

/**
 * Servicio de autenticación real contra el backend LOOka.
 * Hace POST /api/auth/login y devuelve el token JWT + datos del usuario.
 */
export class RealAuthService {
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier: credentials.identifier,
        password: credentials.password,
      });

      const { user, token } = response.data;

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          role: user.role,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Credenciales inválidas',
        };
      }
      return {
        success: false,
        message: 'No pudimos conectar con el servidor. Verifica tu conexión.',
      };
    }
  }
}