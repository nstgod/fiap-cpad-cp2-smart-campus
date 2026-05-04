import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../constants/colors';

const THEME_KEY = '@fiap_smart_campus:theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const salvo = await AsyncStorage.getItem(THEME_KEY);
      if (salvo === 'light' || salvo === 'dark') {
        setTheme(salvo);
      }
      setHydrated(true);
    })();
  }, []);

  const toggleTheme = async () => {
    const proximo = theme === 'dark' ? 'light' : 'dark';
    setTheme(proximo);
    await AsyncStorage.setItem(THEME_KEY, proximo);
  };

  const colors = useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);
  const isDark = theme === 'dark';

  const value = useMemo(
    () => ({ theme, colors, isDark, hydrated, toggleTheme }),
    [theme, colors, isDark, hydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  return ctx;
}
