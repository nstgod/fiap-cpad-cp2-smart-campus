import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../../components/Screen';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FeedbackMessage from '../../components/FeedbackMessage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CadastroScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { colors } = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [errosCampo, setErrosCampo] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validarLocal = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe seu nome completo.';
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      e.email = 'E-mail inválido (ex: usuario@dominio.com).';
    }
    if (!senha || senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres.';
    if (senha !== confirmacao) e.confirmacao = 'A confirmação não confere com a senha.';
    setErrosCampo(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastrar = async () => {
    setErroGeral('');
    setSucesso('');
    if (!validarLocal()) return;

    setCarregando(true);
    const r = await signUp({ nome, email, senha, confirmacao });
    setCarregando(false);

    if (!r.ok) {
      setErroGeral(r.error);
      return;
    }
    setSucesso('Cadastro realizado! Redirecionando para o login...');
    setTimeout(() => router.replace('/login'), 1500);
  };

  const limparCampo = (campo) => {
    if (errosCampo[campo]) {
      setErrosCampo((atual) => ({ ...atual, [campo]: undefined }));
    }
    if (erroGeral) setErroGeral('');
  };

  return (
    <Screen scroll avoidKeyboard>
      <Logo subtitle="Criar conta" />

      <FeedbackMessage type="error" message={erroGeral} />
      <FeedbackMessage type="success" message={sucesso} />

      <Input
        label="Nome completo"
        icon="person-outline"
        value={nome}
        onChangeText={(v) => {
          setNome(v);
          limparCampo('nome');
        }}
        placeholder="Seu nome completo"
        autoCapitalize="words"
        error={errosCampo.nome}
      />

      <Input
        label="E-mail"
        icon="mail-outline"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          limparCampo('email');
        }}
        placeholder="usuario@dominio.com"
        keyboardType="email-address"
        error={errosCampo.email}
      />

      <Input
        label="Senha"
        icon="lock-closed-outline"
        value={senha}
        onChangeText={(v) => {
          setSenha(v);
          limparCampo('senha');
        }}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        error={errosCampo.senha}
      />

      <Input
        label="Confirmar senha"
        icon="lock-closed-outline"
        value={confirmacao}
        onChangeText={(v) => {
          setConfirmacao(v);
          limparCampo('confirmacao');
        }}
        placeholder="Repita a senha"
        secureTextEntry
        error={errosCampo.confirmacao}
      />

      <Button
        title="CADASTRAR"
        onPress={handleCadastrar}
        loading={carregando}
        icon="checkmark-outline"
        style={{ marginTop: spacing.sm }}
      />

      <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace('/login')}>
        <Text style={[styles.linkText, { color: colors.text }]}>
          Já tem conta?{' '}
          <Text style={[styles.linkBold, { color: colors.primary }]}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  linkBtn: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { ...typography.body, fontSize: 14 },
  linkBold: { fontWeight: 'bold' },
});
