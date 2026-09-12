import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Detecta la URL del backend automáticamente según la plataforma:
 *
 * - En WEB: usa el hostname del navegador (localhost o la IP de la PC).
 * - En MÓVIL (Expo Go): usa la IP que Expo le dio al teléfono.
 *
 * Resultado: funciona en cualquier red sin tocar configuración.
 */
function getApiBaseUrl(): string {
  // 1. WEB: el navegador ya sabe desde qué host se está sirviendo.
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      const hostname = window.location.hostname; // "localhost" o "192.168.x.x"
      return `http://${hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
  }

  // 2. MÓVIL: Expo nos dice la IP de la PC que sirve el bundle.
  const hostUri =
    Constants.expoConfig?.hostUri ||
    // @ts-ignore - fallback para versiones antiguas
    Constants.expoGoConfig?.debuggerHost ||
    // @ts-ignore
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  // 3. Fallback improbable
  return 'http://localhost:3000/api';
}

export const BASE_URL = getApiBaseUrl();

console.log('[API] BASE_URL detectada:', BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});