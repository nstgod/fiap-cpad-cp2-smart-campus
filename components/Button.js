import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../constants';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const isGhost = variant === 'ghost';

  const variantBg = {
    primary: colors.primary,
    secondary: colors.surfaceMuted,
    success: colors.success,
    danger: colors.error,
    warning: colors.warning,
    ghost: 'transparent',
  }[variant];

  const textColor = isGhost
    ? colors.primary
    : variant === 'secondary'
      ? colors.text
      : colors.onPrimary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: variantBg },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={textColor}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  text: { ...typography.button },
});
