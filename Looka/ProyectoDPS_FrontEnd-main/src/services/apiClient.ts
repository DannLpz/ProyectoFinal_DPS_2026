/**
 * @file apiClient.ts
 * @description Configura el cliente HTTP compartido por los servicios del frontend.
 * Resuelve la URL base según la plataforma y adjunta credenciales de sesión.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Detecta la URL del backend automáticamente según la plataforma.
 * En web utiliza el hostname del navegador; en móvil usa el host de Expo.
 * @returns URL base de la API, con una dirección local como alternativa.
 */
function getApiBaseUrl(): string {
  // ─────────────────────────────
  // SECCIÓN: Resolución de URL por plataforma
  // ─────────────────────────────
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    // @ts-ignore - fallback versiones antiguas
    Constants.expoGoConfig?.debuggerHost ||
    // @ts-ignore
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  return 'http://localhost:3000/api';
}

/** URL base efectiva calculada una sola vez al cargar el módulo. */
export const BASE_URL = getApiBaseUrl();

if (__DEV__) {
  console.log('[API] BASE_URL detectada:', BASE_URL);
}

/** Cliente Axios configurado para las solicitudes del backend. */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,  // 10 minutos
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────
// SECCIÓN: Autenticación de solicitudes
// ─────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});