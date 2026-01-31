import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/simple';

export function LoadingSpinner({ size = 'large', color }: { size?: 'small' | 'large' | number; color?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
});
