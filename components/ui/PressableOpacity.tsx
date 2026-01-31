/**
 * PressableOpacity
 * A TouchableOpacity wrapper with consistent press feedback
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export interface PressableOpacityProps extends Omit<TouchableOpacityProps, 'style'> {
  children: ReactNode;
  style?: ViewStyle;
  hapticFeedback?: boolean;
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}

export function PressableOpacity({
  children,
  style,
  hapticFeedback = false,
  hapticStyle = 'light',
  activeOpacity = 0.7,
  onPress,
  ...props
}: PressableOpacityProps) {
  const handlePress = (event: any) => {
    if (hapticFeedback && Platform.OS === 'ios') {
      switch (hapticStyle) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          Haptics.selectionAsync();
          break;
      }
    }
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      style={StyleSheet.flatten(style)}
      activeOpacity={activeOpacity}
      onPress={handlePress}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}