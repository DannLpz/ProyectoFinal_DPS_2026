import { useWindowDimensions } from 'react-native';

import { theme } from '../config/theme';

export interface ResponsiveLayout {
  horizontalPadding: number;
  contentWidth: number;
  menuColumns: 2 | 3;
  menuCardWidth: number;
}

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
