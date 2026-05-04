import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, typography } from '../../constants';

const ATALHOS = [
  { rota: '/notas', titulo: 'Notas e Faltas', icone: 'stats-chart-outline' },
  { rota: '/cronograma', titulo: 'Cronograma', icone: 'calendar-outline' },
  { rota: '/kitchenette', titulo: 'Kitchenette', icone: 'fast-food-outline' },
  { rota: '/labs', titulo: 'Reservar Labs', icone: 'desktop-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const primeiroNome = user?.nome ? user.nome.split(' ')[0] : '';

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.saudacao, { color: colors.text }]}>
            Olá{primeiroNome ? `, ${primeiroNome}` : ''}!
          </Text>
          <Text style={[styles.curso, { color: colors.primary }]}>
            Bem-vindo ao Smart Campus
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.themeBtn, { backgroundColor: colors.surface }]}
          onPress={toggleTheme}
          accessibilityLabel="Alternar tema"
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>

        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Acesso Rápido</Text>

      <View style={styles.grid}>
        {ATALHOS.map((a) => (
          <TouchableOpacity
            key={a.rota}
            style={[
              styles.card,
              { backgroundColor: colors.surface, shadowColor: colors.shadow },
            ]}
            onPress={() => router.push(a.rota)}
            activeOpacity={0.7}
          >
            <View style={[styles.cardIconWrap, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name={a.icone} size={28} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{a.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        title="SAIR DA CONTA"
        variant="ghost"
        icon="log-out-outline"
        onPress={handleLogout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  saudacao: { ...typography.h2 },
  curso: { ...typography.caption, fontSize: 14, marginTop: spacing.xs, fontWeight: '600' },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { ...typography.h4, marginBottom: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: { ...typography.label, textAlign: 'center' },
});
