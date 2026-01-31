import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/simple';

export function EmptyState({ message, subMessage, icon }: { message: string; subMessage?: string; icon?: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.message, { color: colors.text, ...typography.title2 }]}>{message}</Text>
      {subMessage && <Text style={[styles.subMessage, { color: colors.textSecondary, ...typography.body }]}>{subMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconContainer: { marginBottom: 16 },
  message: { textAlign: 'center', marginBottom: 8 },
  subMessage: { textAlign: 'center', marginTop: 4 },
});
