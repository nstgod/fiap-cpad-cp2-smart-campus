import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../constants';

export default function Logo({ subtitle = 'Smart Campus', style }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.logo, { color: colors.primary }]}>FIAP</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { ...typography.h1, fontSize: 48 },
  subtitle: { ...typography.body, letterSpacing: 2, marginTop: spacing.xs },
});
