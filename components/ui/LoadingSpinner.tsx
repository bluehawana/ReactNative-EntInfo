import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/simple';
import { ActivityIndicator } from 'react-native';

export function LoadingSpinner({ size = 'large', color }: { size?: 'small' | 'large' | number; color?: string }) {
  return <View style={styles.container}><ActivityIndicator size={size} color={color || colors.primary} /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 } });
