import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
