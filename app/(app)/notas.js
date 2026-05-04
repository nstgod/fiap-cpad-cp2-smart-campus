import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, typography } from '../../constants';

const DISCIPLINAS = [
  { nome: 'CROSS-PLATFORM APP DEV', faltas1: 0, faltas2: 0, aulas: 80, presenca: '100%' },
  { nome: 'APPLICATION DEVELOPMENT', faltas1: 2, faltas2: 0, aulas: 80, presenca: '97.5%' },
  { nome: 'DATA SCIENCE AND ANALYTICS', faltas1: 2, faltas2: 0, aulas: 80, presenca: '97.5%' },
  { nome: 'EDGE COMPUTING', faltas1: 4, faltas2: 0, aulas: 80, presenca: '95%' },
  { nome: 'OBJECT-ORIENTED PROGRAMMING', faltas1: 2, faltas2: 0, aulas: 80, presenca: '97.5%' },
  { nome: 'OPERATING SYSTEMS', faltas1: 2, faltas2: 0, aulas: 80, presenca: '97.5%' },
  { nome: 'SOFTWARE ENGINEERING', faltas1: 2, faltas2: 0, aulas: 80, presenca: '97.5%' },
];

export default function NotasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [indexAtual, setIndexAtual] = useState(0);

  const materiaAtual = DISCIPLINAS[indexAtual];
  const proxima = () => indexAtual < DISCIPLINAS.length - 1 && setIndexAtual(indexAtual + 1);
  const anterior = () => indexAtual > 0 && setIndexAtual(indexAtual - 1);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.titulo, { color: colors.primary }]}>Boletim</Text>
          <Text style={[styles.subtitulo, { color: colors.textMuted }]}>2CCPG · 2026</Text>
        </View>
      </View>

      <View style={[styles.seletorContainer, { backgroundColor: colors.surfaceMuted }]}>
        <TouchableOpacity onPress={anterior} disabled={indexAtual === 0} style={styles.btnNav}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={indexAtual === 0 ? colors.textMuted : colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.materiaBox}>
          <Text
            style={[styles.materiaTexto, { color: colors.text }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {materiaAtual.nome}
          </Text>
          <Text style={[styles.materiaContador, { color: colors.textMuted }]}>
            {indexAtual + 1} / {DISCIPLINAS.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={proxima}
          disabled={indexAtual === DISCIPLINAS.length - 1}
          style={styles.btnNav}
        >
          <Ionicons
            name="chevron-forward"
            size={28}
            color={indexAtual === DISCIPLINAS.length - 1 ? colors.textMuted : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dashboard}>
        <View
          style={[
            styles.cardSemestre,
            { backgroundColor: colors.surface, borderLeftColor: colors.primary },
          ]}
        >
          <Text style={[styles.cardTitulo, { color: colors.textMuted }]}>1º Semestre</Text>
          <View style={styles.rowStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>CP</Text>
              <Text style={[styles.statValor, { color: colors.text }]}>-</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>GS</Text>
              <Text style={[styles.statValor, { color: colors.text }]}>-</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Faltas</Text>
              <Text style={[styles.statValor, { color: colors.primary }]}>
                {materiaAtual.faltas1}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.cardSemestre,
            { backgroundColor: colors.surface, borderLeftColor: colors.primary },
          ]}
        >
          <Text style={[styles.cardTitulo, { color: colors.textMuted }]}>2º Semestre</Text>
          <View style={styles.rowStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>CP</Text>
              <Text style={[styles.statValor, { color: colors.text }]}>-</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>GS</Text>
              <Text style={[styles.statValor, { color: colors.text }]}>-</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Faltas</Text>
              <Text style={[styles.statValor, { color: colors.primary }]}>
                {materiaAtual.faltas2}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.cardResumo, { backgroundColor: colors.primary }]}>
          <View style={styles.statItem}>
            <Text style={styles.statLabelLight}>Total de Aulas</Text>
            <Text style={styles.statValorLight}>{materiaAtual.aulas}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabelLight}>Presença</Text>
            <Text style={styles.statValorLight}>{materiaAtual.presenca}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Voltar para Home"
        variant="ghost"
        icon="home-outline"
        onPress={() => router.replace('/home')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  btnVoltar: { padding: spacing.xs, marginRight: spacing.sm },
  titulo: { ...typography.h2 },
  subtitulo: { ...typography.caption, fontSize: 13, letterSpacing: 1 },

  seletorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  btnNav: { padding: spacing.sm + 2 },
  materiaBox: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.sm + 2 },
  materiaTexto: { ...typography.bodyBold, textAlign: 'center' },
  materiaContador: { ...typography.caption, marginTop: 2 },

  dashboard: { flex: 1 },
  cardSemestre: {
    padding: spacing.md - 2,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
  },
  cardTitulo: { ...typography.label, marginBottom: spacing.md - 4 },
  rowStats: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.sm + 2 },

  cardResumo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md + 4,
    borderRadius: radius.md,
    marginTop: spacing.sm + 2,
  },

  statItem: { alignItems: 'center' },
  statLabel: { ...typography.caption, marginBottom: spacing.xs, opacity: 0.7 },
  statLabelLight: { color: '#FFF', ...typography.caption, marginBottom: spacing.xs, opacity: 0.9 },
  statValor: { ...typography.h3 },
  statValorLight: { color: '#FFF', ...typography.h3 },
});
