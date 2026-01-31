/**
 * WatchlistButton
 * Toggle button for adding/removing from watchlist
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/simple';
import { PressableOpacity } from './PressableOpacity';

export interface WatchlistButtonProps {
  inWatchlist: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function WatchlistButton({
  inWatchlist,
  onToggle,
  size = 'medium',
  style,
  textStyle,
}: WatchlistButtonProps) {
  const sizeStyles = {
    small: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.caption.fontSize,
      iconSize: 16,
    },
    medium: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      fontSize: typography.callout.fontSize,
      iconSize: 18,
    },
    large: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      fontSize: typography.body.fontSize,
      iconSize: 20,
    },
  };

  const sizeStyle = sizeStyles[size];

  return (
    <PressableOpacity
      style={styles.button}
      onPress={onToggle}
      activeOpacity={0.7}
      hapticFeedback
    >
      <View style={styles.content}>
        <Text style={[styles.icon, { fontSize: sizeStyle.iconSize, color: inWatchlist ? colors.textInverse : colors.primary }]}>
          {inWatchlist ? '✓' : '+'}
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyle.fontSize,
              color: inWatchlist ? colors.textInverse : colors.primary,
            },
            textStyle,
          ]}
        >
          {inWatchlist ? 'Saved' : 'Watchlist'}
        </Text>
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    borderRadius: borderRadius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontWeight: '600',
  },
});
