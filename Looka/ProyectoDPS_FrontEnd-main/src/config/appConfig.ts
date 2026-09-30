/**
 * @file appConfig.ts
 * @description Centraliza los valores de configuración propios de LOOka.
 * Expone ajustes compartidos por los componentes de la aplicación.
 * @author Equipo LOOka
 * @version 2.0.0
 */

/** Configuración estática de identidad y presentación de la aplicación. */
export const appConfig = {
  name: 'LOOka',
  tagline: 'Tu espacio. Tu estilo. Antes de comprar.',
  splashDurationMs: 1800,
  mockAuthDelayMs: 850,
  demoCredentials: {
    username: 'demo',
    password: 'demo123',
  },
} as const;
