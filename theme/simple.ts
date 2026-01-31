/**
 * Theme System
 * Simple, direct exports for consistent styling
 */

import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  success: '#34C759',
  warning: '#FFCC00',
  error: '#FF3B30',
  info: '#5AC8FA',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F7',
  surface: '#F9F9F9',
  surfaceSecondary: '#F0F0F2',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#8E8E93',
  textInverse: '#FFFFFF',
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography: Record<string, TextStyle> = {
  display: { fontSize: 34, fontWeight: '700', lineHeight: 41 },
  headline: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  title: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  title2: { fontSize: 20, fontWeight: '600', lineHeight: 25 },
  title3: { fontSize: 18, fontWeight: '600', lineHeight: 23 },
  body: { fontSize: 17, fontWeight: '400', lineHeight: 22 },
  bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 24 },
  callout: { fontSize: 16, fontWeight: '400', lineHeight: 21 },
  subhead: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  caption2: { fontSize: 11, fontWeight: '400', lineHeight: 13 },
};

export const shadows: Record<string, ViewStyle> = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  button: 10,
};
