import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, typography } from '../../constants';

const AULAS = {
  SEG: [
    {
      id: 1,
      materia: 'OBJECT-ORIENTED PROGRAMMING',
      prof: 'YGOR MORAES MARTINS DOS ANJOS',
      horario: '08H10 ÀS 09H50',
      tipo: 'PRESENCIAL',
      local: 'LAB. 302 · ANDAR 3 · PAULISTA',
    },
    {
      id: 2,
      materia: 'CROSS-PLATFORM APPLICATION DEVELOPMENT',
      prof: 'HERCULES LIMA RAMOS',
      horario: '10H10 ÀS 11H50',
      tipo: 'PRESENCIAL',
      local: 'LAB. 302 · ANDAR 3 · PAULISTA',
    },
  ],
  TER: [],
  QUA: [
    { id: 3, materia: 'OPERATING SYSTEMS AND COMPUTER NETWORKS', prof: 'VICTOR RIBEIRO FERNANDES', horario: '08H10 ÀS 09H50' },
    { id: 4, materia: 'SOFTWARE ENGINEERING', prof: 'HERNANI BERNARDO MARQUES', horario: '10H10 ÀS 11H50' },
  ],
  QUI: [
    { id: 5, materia: 'APPLICATION DEVELOPMENT', prof: 'ALLAN ROBERTO MOLTO', horario: '08H10 ÀS 09H50' },
    { id: 6, materia: 'DATA SCIENCE AND ANALYTICS', prof: 'ROBERTO GUTIERREZ BERALDO', horario: '10H10 ÀS 11H50' },
  ],
  SEX: [
    { id: 7, materia: 'APRENDIZADO PROFUNDO COM REDES NEURAIS...', prof: 'FERNANDO NASCIMENTO DA SILVA', horario: '08H10 ÀS 09H50' },
    { id: 8, materia: 'EDGE COMPUTING', prof: 'LUCAS GOMES MOREIRA', horario: '10H10 ÀS 11H50' },
  ],
};

const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];

export default function CronogramaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [dia, setDia] = useState('SEG');
  const aulasDoDia = AULAS[dia];

  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: colors.primary }]}>Cronograma</Text>
      </View>

      <View style={[styles.seletorContainer, { backgroundColor: colors.surfaceMuted }]}>
        {DIAS.map((d) => {
          const ativo = dia === d;
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.btnDia,
                ativo && { backgroundColor: colors.primary },
              ]}
              onPress={() => setDia(d)}
            >
              <Text
                style={[
                  styles.txtDia,
                  { color: colors.textMuted },
                  ativo && { color: colors.onPrimary },
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {aulasDoDia.length === 0 ? (
          <EmptyState
            icon="cafe-outline"
            title="Sem aulas neste dia"
            description="Aproveite para descansar ou estudar."
          />
        ) : (
          aulasDoDia.map((aula) => (
            <View
              key={aula.id}
              style={[
                styles.cardAula,
                { backgroundColor: colors.surface, borderLeftColor: colors.primary },
              ]}
            >
              {aula.tipo && (
                <View style={[styles.badgePresencial, { backgroundColor: colors.primary }]}>
                  <Ionicons name="location-outline" size={10} color="#FFF" />
                  <Text style={styles.badgeTexto}>{aula.tipo}</Text>
                </View>
              )}
              {aula.local && (
                <Text style={[styles.localTexto, { color: colors.primary }]}>{aula.local}</Text>
              )}

              <Text style={[styles.materiaTexto, { color: colors.text }]}>{aula.materia}</Text>
              <View style={styles.profContainer}>
                <Ionicons name="person-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.profTexto, { color: colors.textMuted }]}>{aula.prof}</Text>
              </View>

              <View style={styles.horarioContainer}>
                <Ionicons name="time-outline" size={14} color={colors.text} />
                <Text style={[styles.horarioTexto, { color: colors.text }]}>{aula.horario}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

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
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  btnVoltar: { padding: spacing.xs, marginRight: spacing.sm },
  titulo: { ...typography.h2 },

  seletorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    padding: spacing.xs + 1,
    marginBottom: spacing.md,
  },
  btnDia: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 1,
    borderRadius: radius.sm + 2,
  },
  txtDia: { ...typography.label, fontSize: 14 },

  cardAula: {
    borderLeftWidth: 4,
    padding: spacing.md - 2,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  badgePresencial: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.sm,
    marginBottom: spacing.xs + 1,
    gap: 2,
  },
  badgeTexto: { color: '#FFF', ...typography.captionBold, fontSize: 10, marginLeft: 2 },
  localTexto: { ...typography.captionBold, marginBottom: spacing.sm + 2 },
  materiaTexto: { ...typography.bodyBold, marginBottom: spacing.xs + 1 },
  profContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md - 4,
    gap: 4,
  },
  profTexto: { ...typography.caption },
  horarioContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  horarioTexto: { ...typography.captionBold, marginLeft: 4 },
});
