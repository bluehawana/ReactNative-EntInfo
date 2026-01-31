import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/simple';
import { PressableOpacity } from './PressableOpacity';

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.error, ...typography.body }]}>{message}</Text>
      {onRetry && (
        <PressableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={onRetry} activeOpacity={0.8}>
          <Text style={[styles.retryText, { color: colors.textInverse, ...typography.callout }]}>Retry</Text>
        </PressableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  message: { textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  retryText: { fontWeight: '600' },
});
