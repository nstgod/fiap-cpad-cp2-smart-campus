import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../constants';

export default function FeedbackMessage({ type = 'info', message, style }) {
  const { colors } = useTheme();
  if (!message) return null;

  const config = {
    success: { bg: colors.successBg, color: colors.success, icon: 'checkmark-circle' },
    error: { bg: colors.errorBg, color: colors.error, icon: 'alert-circle' },
    warning: { bg: colors.warningBg, color: colors.warning, icon: 'warning' },
    info: { bg: colors.infoBg, color: colors.info, icon: 'information-circle' },
  }[type] || { bg: colors.infoBg, color: colors.info, icon: 'information-circle' };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.color },
        style,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.color}
        style={{ marginRight: spacing.sm }}
      />
      <Text style={[styles.text, { color: config.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  text: { ...typography.caption, fontSize: 14, flex: 1, fontWeight: '600' },
});
