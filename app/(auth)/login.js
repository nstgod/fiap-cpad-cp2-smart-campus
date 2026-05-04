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

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setCarregando(true);
    const r = await signIn({ email, senha });
    setCarregando(false);

    if (!r.ok) {
      setErro(r.error);
      return;
    }
    router.replace('/home');
  };

  return (
    <Screen scroll avoidKeyboard>
      <View style={styles.center}>
        <Logo />

        <FeedbackMessage type="error" message={erro} />

        <Input
          label="E-mail"
          icon="mail-outline"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (erro) setErro('');
          }}
          placeholder="usuario@dominio.com"
          keyboardType="email-address"
        />

        <Input
          label="Senha"
          icon="lock-closed-outline"
          value={senha}
          onChangeText={(v) => {
            setSenha(v);
            if (erro) setErro('');
          }}
          placeholder="Sua senha"
          secureTextEntry
        />

        <Button
          title="ENTRAR"
          onPress={handleLogin}
          loading={carregando}
          icon="log-in-outline"
          style={{ marginTop: spacing.sm }}
        />

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/cadastro')}>
          <Text style={[styles.linkText, { color: colors.text }]}>
            Não tem conta?{' '}
            <Text style={[styles.linkBold, { color: colors.primary }]}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  linkBtn: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { ...typography.body, fontSize: 14 },
  linkBold: { fontWeight: 'bold' },
});
