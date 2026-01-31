/**
 * Skeleton
 * Loading placeholder with shimmer effect
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({
  width = '100%',
  height = 20,
  style,
  variant = 'rect',
}: SkeletonProps) {
  const colors = useThemeColors();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.borderLight, colors.surfaceSecondary],
  });

  const baseStyle: ViewStyle = {
    width,
    height,
    backgroundColor: shimmerColor,
  };

  const variantStyles: Record<typeof variant, ViewStyle> = {
    rect: baseStyle,
    circle: { ...baseStyle, borderRadius: width === '100%' ? 0 : (typeof width === 'number' ? width : height) / 2 },
    text: { ...baseStyle, borderRadius: 4 },
  };

  return (
    <Animated.View style={[styles.skeleton, variantStyles[variant], style]} />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
