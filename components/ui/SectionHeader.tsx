/**
 * SectionHeader
 * Consistent section headers with optional action
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme/simple';
import { PressableOpacity } from './PressableOpacity';

export interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  actionStyle?: TextStyle;
}

export function SectionHeader({
  title,
  action,
  onActionPress,
  style,
  titleStyle,
  actionStyle,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, style]}>
      <Text style={[{ ...typography.title3, color: colors.text }, titleStyle]}>{title}</Text>
      {action && onActionPress && (
        <PressableOpacity onPress={onActionPress}>
          <Text style={[{ ...typography.callout, color: colors.primary, fontWeight: '600' }, actionStyle]}>{action}</Text>
        </PressableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
