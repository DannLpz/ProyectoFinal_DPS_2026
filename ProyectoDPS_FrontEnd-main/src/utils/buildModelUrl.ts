import { BASE_URL } from '../services/apiClient';

/**
 * Convierte una ruta de modelo a URL absoluta.
 * Es robusto ante:
 *   - Rutas relativas: "/models/silla.glb"
 *   - URLs rotas: "http://:3000/models/silla.glb"
 *   - URLs completas: "https://ejemplo.com/modelo.glb"
 */
export function buildModelUrl(path: string): string {
  const apiBase = BASE_URL.replace('/api', '');

  if (!path) return apiBase;

  // 1. Si es URL completa CON host válido y NO es de nuestra IP, la respetamos.
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const match = path.match(/^https?:\/\/([^\/:]+)/);
    const host = match ? match[1] : '';

    // Si el host NO está vacío, es una URL completa válida
    if (host && host.length > 0) {
      return path;
    }

    // Host vacío (http://:3000/...) → extraemos solo la ruta
    const slashIndex = path.indexOf('/', path.indexOf('//') + 2);
    if (slashIndex !== -1) {
      const relativePath = path.substring(slashIndex);
      return `${apiBase}${relativePath}`;
    }
    return apiBase;
  }

  // 2. Ruta relativa → completar
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${cleanPath}`;
}