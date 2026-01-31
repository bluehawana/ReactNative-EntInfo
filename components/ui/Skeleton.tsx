/**
 * Skeleton
 * Loading placeholder with shimmer effect
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors } from '../../theme/simple';

export interface SkeletonProps {
  width?: number | `${number}%`;
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

  const getBorderRadius = () => {
    if (variant === 'circle') {
      return (typeof width === 'number' ? width : height) / 2;
    }
    if (variant === 'text') {
      return 4;
    }
    return 0;
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: shimmerColor,
          borderRadius: getBorderRadius(),
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
