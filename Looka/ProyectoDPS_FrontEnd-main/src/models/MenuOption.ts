/**
 * @file MenuOption.ts
 * @description Define los tipos y datos que componen las opciones de navegación.
 * Limita los iconos y tecnologías a los valores admitidos por la interfaz.
 * @author Equipo LOOka
 * @version 2.0.0
 */

/** Nombres de icono admitidos por las opciones del menú. */
export type MenuIconName =
  | 'shopping-bag'
  | 'star'
  | 'box'
  | 'heart'
  | 'shopping-cart'
  | 'plus-square';

/** Tecnologías que pueden asociarse a una opción de menú. */
export type FutureTechnology = 'AR' | 'IA';

/** Datos necesarios para representar una opción de navegación. */
export interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: MenuIconName;
  accentColor: string;
  technology?: FutureTechnology;
}
