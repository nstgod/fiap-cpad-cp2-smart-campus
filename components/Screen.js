import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants';

export default function Screen({
  children,
  scroll = false,
  avoidKeyboard = false,
  padded = true,
  style,
  contentContainerStyle,
}) {
  const { colors } = useTheme();
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? {
        contentContainerStyle: [
          padded && styles.padded,
          { flexGrow: 1 },
          contentContainerStyle,
        ],
        keyboardShouldPersistTaps: 'handled',
        showsVerticalScrollIndicator: false,
      }
    : { style: [padded && styles.padded, { flex: 1 }] };

  const content = (
    <Container {...containerProps}>
      <StatusBar barStyle={colors.statusBar} />
      {children}
    </Container>
  );

  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.background }, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.lg,
  },
});
