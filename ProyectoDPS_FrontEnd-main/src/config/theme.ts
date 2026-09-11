import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

const colors = {
  primary: '#B01938',
  primaryDark: '#781D30',
  primarySoft: '#F7DDE2',
  cream: '#F7EAD6',
  creamDark: '#EACFAE',
  caramel: '#D89C70',
  brown: '#8B5C3C',
  coral: '#DE7E6C',
  background: '#FCF8F2',
  surface: '#FFFFFF',
  text: '#2E2425',
  textMuted: '#75696B',
  border: '#E9DDD4',
  error: '#B3261E',
  success: '#4E7D45',
  warning: '#A96316',
  overlay: 'rgba(46, 36, 37, 0.52)',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

const typography = {
  hero: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
  } satisfies TextStyle,
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.4,
  } satisfies TextStyle,
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } satisfies TextStyle,
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  } satisfies TextStyle,
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
} as const;

const createPlatformShadow = (
  boxShadow: string,
  nativeStyle: ViewStyle,
): ViewStyle => (Platform.OS === 'web' ? { boxShadow } : nativeStyle);

const shadows = {
  card: createPlatformShadow('0px 10px 22px rgba(91, 53, 64, 0.10)', {
    shadowColor: '#5B3540',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 5,
  }),
  subtle: createPlatformShadow('0px 5px 12px rgba(91, 53, 64, 0.08)', {
    shadowColor: '#5B3540',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  }),
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  layout: {
    maxContentWidth: 920,
    maxFormWidth: 460,
    minTouchTarget: 48,
  },
} as const;

export type AppTheme = typeof theme;
