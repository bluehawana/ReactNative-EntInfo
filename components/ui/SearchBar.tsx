import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/simple';
import { PressableOpacity } from './PressableOpacity';
import { Ionicons } from '@expo/vector-icons';

export function SearchBar({ value, onChangeText, onClear, placeholder = 'Search...', style, autoFocus }: { value: string; onChangeText: (text: string) => void; onClear?: () => void; placeholder?: string; style?: any; autoFocus?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const handleClear = () => { onChangeText(''); onClear?.(); };

  return (
    <View style={[styles.container, isFocused && { borderWidth: 2, borderColor: colors.primary }, { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.button, ...shadows.sm }, style]}>
      <Ionicons name="search" size={18} color={colors.textTertiary} style={{ marginRight: spacing.sm }} />
      <TextInput style={[styles.input, { ...colors.body, color: colors.text }]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textTertiary} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} autoFocus={autoFocus} autoCapitalize="none" autoCorrect={false} />
      {value.length > 0 && <PressableOpacity onPress={handleClear} style={styles.clearButton}><Ionicons name="close-circle" size={18} color={colors.textTertiary} /></PressableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flexDirection: 'row', alignItems: 'center' }, input: { flex: 1, padding: 0 }, clearButton: { marginLeft: 8, padding: 4 } });
