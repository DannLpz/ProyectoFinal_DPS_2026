/**
 * @file RealAuthService.ts
 * @description Implementa la autenticación contra los endpoints del backend.
 * Normaliza las respuestas y los errores HTTP al contrato del cliente.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import axios from 'axios';
import { apiClient } from './apiClient';
import type { AuthCredentials, AuthResult } from '../models/AuthResult';

/** Servicio de autenticación remota para inicio de sesión de usuarios. */
export class RealAuthService {
  /**
   * Valida las credenciales contra el backend y normaliza el resultado.
   * @param credentials Identificador y contraseña ingresados por el usuario.
   * @returns Resultado de autenticación exitoso o mensaje de rechazo.
   */
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