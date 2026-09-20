import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Detecta la URL del backend automáticamente según la plataforma:
 *  - WEB: usa el hostname del navegador.
 *  - MÓVIL: usa la IP que Expo asignó a la PC.
 *
 * No requiere configuración manual.
 */
function getApiBaseUrl(): string {
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

// Se calcula UNA SOLA VEZ al cargar el módulo
export const BASE_URL = getApiBaseUrl();

if (__DEV__) {
  console.log('[API] BASE_URL detectada:', BASE_URL);
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // 5 minutos
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token JWT en cada petición si el usuario está autenticado
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});