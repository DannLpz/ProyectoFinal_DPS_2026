/**
 * @file useResponsiveLayout.ts
 * @description Expone medidas y decisiones de diseño según el tamaño de ventana.
 * Mantiene el cálculo del layout ligado a las dimensiones actuales del dispositivo.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { useWindowDimensions } from 'react-native';

import { theme } from '../config/theme';

/** Medidas derivadas de la ventana para organizar el contenido responsivo. */
export interface ResponsiveLayout {
  horizontalPadding: number;
  contentWidth: number;
  menuColumns: 2 | 3;
  menuCardWidth: number;
}

/**
 * Obtiene las dimensiones y parámetros de layout vigentes.
 * @returns Medidas y configuración responsiva para la pantalla actual.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();
  const horizontalPadding = width < 360 ? theme.spacing.md : theme.spacing.lg;
  const contentWidth = Math.min(width, theme.layout.maxContentWidth);
  const menuColumns: 2 | 3 = contentWidth >= 720 ? 3 : 2;
  const availableWidth = contentWidth - horizontalPadding * 2;
  const totalGaps = theme.spacing.sm * (menuColumns - 1);
  const menuCardWidth = (availableWidth - totalGaps) / menuColumns;

  return {
    horizontalPadding,
    contentWidth,
    menuColumns,
    menuCardWidth,
  };
}
