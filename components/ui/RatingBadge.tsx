/**
 * RatingBadge
 * Display rating in a badge format
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme/simple';

export interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  showDecimal?: boolean;
}

export function RatingBadge({
  rating,
  maxRating = 10,
  size = 'small',
  style,
  textStyle,
  showDecimal = true,
}: RatingBadgeProps) {
  const displayRating = showDecimal ? rating.toFixed(1) : Math.round(rating);
  const percentage = (rating / maxRating) * 100;

  const getRatingColor = (): string => {
    if (percentage >= 70) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.error;
  };

  const sizeConfig = {
    small: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 4,
      fontSize: typography.caption.fontSize,
    },
    medium: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 6,
      fontSize: typography.caption.fontSize,
    },
    large: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      fontSize: typography.callout.fontSize,
    },
  };

  const config = sizeConfig[size];
  const ratingColor = getRatingColor();

  return (
    <View
      style={[
        styles.badge,
        {
          paddingVertical: config.paddingVertical,
          paddingHorizontal: config.paddingHorizontal,
          borderRadius: config.borderRadius,
          backgroundColor: `${ratingColor}15`,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: ratingColor,
          },
          textStyle,
        ]}
      >
        {displayRating}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
