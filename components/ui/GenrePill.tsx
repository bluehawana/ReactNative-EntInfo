/**
 * GenrePill
 * Display genre tags in pill format
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors, useThemeSpacing, useThemeTypography, useThemeBorderRadius } from '../../theme/ThemeContext';

export interface GenrePillProps {
  genre: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export function GenrePill({ genre, style, textStyle, size = 'medium' }: GenrePillProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const typography = useThemeTypography();
  const borderRadius = useThemeBorderRadius();

  const sizeStyles = {
    small: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      fontSize: typography.caption.fontSize,
    },
    medium: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.caption.fontSize,
    },
    large: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      fontSize: typography.callout.fontSize,
    },
  };

  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.pill,
        {
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          borderRadius: borderRadius.full,
          backgroundColor: colors.surfaceSecondary,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
            color: colors.text,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {genre}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});
