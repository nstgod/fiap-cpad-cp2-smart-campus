import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FeedbackMessage from '../../components/FeedbackMessage';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, typography } from '../../constants';

export default function LabsScreen() {
  const router = useRouter();
  const { reservas, reservarLab, cancelarReserva } = useAppData();
  const { colors } = useTheme();

  const [andar, setAndar] = useState(1);
  const [carregandoLabs, setCarregandoLabs] = useState(false);
  const [labsData, setLabsData] = useState([]);
  const [confirmarCancelar, setConfirmarCancelar] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  useEffect(() => {
    setCarregandoLabs(true);
    const timer = setTimeout(() => {
      const finaisSalas = [0, 1, 2, 3, 4, 5, 6, 7];
      const novosLabs = finaisSalas.map((final) => {
        const numeroLab = andar * 100 + final;
        return {
          id: numeroLab,
          isLivre: numeroLab % 2 === 0,
          temperatura: Math.floor(Math.random() * (26 - 18 + 1)) + 18,
        };
      });
      setLabsData(novosLabs);
      setCarregandoLabs(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [andar]);

  const reservaDoLab = (labId) => reservas.find((r) => r.labId === labId);

  const mostrarFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: '' }), 2500);
  };

  const handleReservar = async (lab) => {
    const r = await reservarLab({ labId: lab.id, andar });
    if (!r.ok) {
      mostrarFeedback('error', r.error);
      return;
    }
    mostrarFeedback('success', `Lab ${lab.id} reservado com sucesso!`);
  };

  const handleCancelar = async (reservaId) => {
    if (confirmarCancelar !== reservaId) {
      setConfirmarCancelar(reservaId);
      setTimeout(() => setConfirmarCancelar(null), 3000);
      return;
    }
    await cancelarReserva(reservaId);
    setConfirmarCancelar(null);
    mostrarFeedback('info', 'Reserva cancelada.');
  };

  const getCorTemperatura = (temp) => {
    if (temp <= 20) return colors.info;
    if (temp <= 24) return colors.success;
    return colors.warning;
  };

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: colors.primary }]}>Reservar Labs</Text>
      </View>
      <Text style={[styles.descricao, { color: colors.textMuted }]}>
        Selecione o andar para consultar disponibilidade
      </Text>

      <FeedbackMessage type={feedback.type || 'info'} message={feedback.message} />

      <View style={[styles.andaresContainer, { backgroundColor: colors.surfaceMuted }]}>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.btnAndar,
              andar === num && { backgroundColor: colors.primary },
            ]}
            onPress={() => setAndar(num)}
          >
            <Text
              style={[
                styles.txtAndar,
                { color: colors.text },
                andar === num && { color: colors.onPrimary },
              ]}
            >
              {num}º
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labsContainer}>
        {carregandoLabs ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Lendo sensores do {andar}º andar...
            </Text>
          </View>
        ) : (
          labsData.map((lab) => {
            const reserva = reservaDoLab(lab.id);
            const podeReservar = lab.isLivre && !reserva;

            return (
              <View
                key={lab.id}
                style={[
                  styles.labCard,
                  { backgroundColor: colors.surface, shadowColor: colors.shadow },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.labNome, { color: colors.text }]}>Lab {lab.id}</Text>
                  <View
                    style={[
                      styles.tempContainer,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    <Ionicons
                      name={lab.temperatura <= 20 ? 'snow-outline' : 'thermometer-outline'}
                      size={14}
                      color={getCorTemperatura(lab.temperatura)}
                    />
                    <Text style={[styles.tempTexto, { color: getCorTemperatura(lab.temperatura) }]}>
                      {lab.temperatura}°C
                    </Text>
                  </View>
                </View>

                {reserva ? (
                  <TouchableOpacity
                    style={[styles.btnStatus, { backgroundColor: colors.warning }]}
                    onPress={() => handleCancelar(reserva.id)}
                  >
                    <Ionicons name="close-circle-outline" size={14} color="#FFF" />
                    <Text style={styles.btnStatusText}>
                      {confirmarCancelar === reserva.id ? 'Confirmar?' : 'Reservado'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.btnStatus,
                      { backgroundColor: podeReservar ? colors.success : colors.error },
                    ]}
                    disabled={!podeReservar}
                    onPress={() => podeReservar && handleReservar(lab)}
                  >
                    <Ionicons
                      name={podeReservar ? 'checkmark-circle-outline' : 'lock-closed-outline'}
                      size={14}
                      color="#FFF"
                    />
                    <Text style={styles.btnStatusText}>
                      {podeReservar ? 'Reservar' : 'Em uso'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      <View
        style={[
          styles.minhasReservasContainer,
          { backgroundColor: colors.surface, shadowColor: colors.shadow },
        ]}
      >
        <Text style={[styles.minhasReservasTitulo, { color: colors.text }]}>
          Minhas Reservas
        </Text>
        {reservas.length === 0 ? (
          <EmptyState
            icon="bookmark-outline"
            title="Nenhuma reserva ativa"
            description="Reserve um laboratório acima para vê-lo aqui."
          />
        ) : (
          reservas.map((r) => (
            <View
              key={r.id}
              style={[styles.reservaItem, { borderBottomColor: colors.borderLight }]}
            >
              <View style={styles.reservaInfo}>
                <Ionicons name="desktop-outline" size={20} color={colors.primary} />
                <View style={{ marginLeft: spacing.sm }}>
                  <Text style={[styles.reservaTexto, { color: colors.text }]}>
                    Lab {r.labId}
                  </Text>
                  <Text style={[styles.reservaSubTexto, { color: colors.textMuted }]}>
                    {r.andar}º andar
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.btnCancelarReserva,
                  { backgroundColor: colors.error },
                  confirmarCancelar === r.id && { backgroundColor: colors.warning },
                ]}
                onPress={() => handleCancelar(r.id)}
              >
                <Text style={styles.btnCancelarTexto}>
                  {confirmarCancelar === r.id ? 'Confirmar?' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  btnVoltar: { padding: spacing.xs, marginRight: spacing.sm },
  titulo: { ...typography.h2 },
  descricao: { ...typography.body, marginBottom: spacing.md },

  andaresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  btnAndar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md - 4,
    borderRadius: radius.md,
  },
  txtAndar: { fontWeight: 'bold', fontSize: 16 },

  labsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  loadingBox: { width: '100%', alignItems: 'center', paddingVertical: spacing.xl },
  loadingText: { ...typography.body, marginTop: spacing.md },

  labCard: {
    width: '48%',
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  labNome: { ...typography.bodyBold },

  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm - 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm + 2,
  },
  tempTexto: { ...typography.captionBold, fontSize: 13, marginLeft: 4 },

  btnStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md - 2,
    width: '100%',
    gap: 4,
  },
  btnStatusText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },

  minhasReservasContainer: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  minhasReservasTitulo: { ...typography.h4, marginBottom: spacing.sm },
  reservaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  reservaInfo: { flexDirection: 'row', alignItems: 'center' },
  reservaTexto: { ...typography.bodyBold },
  reservaSubTexto: { ...typography.caption },
  btnCancelarReserva: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.md - 2,
  },
  btnCancelarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
