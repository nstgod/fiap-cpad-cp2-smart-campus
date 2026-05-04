import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../constants';

export default function EmptyState({ icon = 'cube-outline', title, description, style }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
      {description && (
        <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.h4, marginTop: spacing.md, textAlign: 'center' },
  description: { ...typography.caption, fontSize: 14, marginTop: spacing.xs, textAlign: 'center' },
});
