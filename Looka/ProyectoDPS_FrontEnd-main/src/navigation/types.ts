/**
 * @file types.ts
 * @description Declara los parámetros de navegación de pila y pestañas.
 * Estos tipos mantienen consistentes las rutas y sus datos entre pantallas.
 * @author Equipo LOOka
 * @version 2.0.0
 */

/** Parámetros de ruta admitidos por el navegador de pila raíz. */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  Publish: { preselectedItemId?: string } | undefined;
  Favorites: undefined;
  Cart: undefined;
};

/** Parámetros de ruta admitidos por las pestañas principales. */
export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  ForYou: undefined;
  AR: { preselectedItemId?: string } | undefined;
};