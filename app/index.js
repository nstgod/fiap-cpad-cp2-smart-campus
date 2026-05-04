import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants';
import Logo from '../components/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace('/home');
    else router.replace('/login');
  }, [loading, user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Logo />
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
