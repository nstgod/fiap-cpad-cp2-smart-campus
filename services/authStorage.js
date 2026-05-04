import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@fiap_smart_campus:users';
const SESSION_KEY = '@fiap_smart_campus:session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function registerUser({ nome, email, senha, confirmacao }) {
  const nomeTrim = (nome || '').trim();
  const emailTrim = (email || '').trim().toLowerCase();

  if (!nomeTrim) return { ok: false, error: 'Informe seu nome completo.' };
  if (!emailTrim || !EMAIL_REGEX.test(emailTrim)) {
    return { ok: false, error: 'Informe um e-mail válido (ex: usuario@dominio.com).' };
  }
  if (!senha || senha.length < 6) {
    return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
  }
  if (senha !== confirmacao) {
    return { ok: false, error: 'A confirmação de senha não confere.' };
  }

  const users = await getUsers();
  if (users.some((u) => u.email === emailTrim)) {
    return { ok: false, error: 'Já existe uma conta com este e-mail.' };
  }

  const novoUsuario = { nome: nomeTrim, email: emailTrim, senha };
  const novaLista = [...users, novoUsuario];
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(novaLista));

  return { ok: true, user: { nome: nomeTrim, email: emailTrim } };
}

export async function loginUser({ email, senha }) {
  const emailTrim = (email || '').trim().toLowerCase();
  if (!emailTrim || !senha) {
    return { ok: false, error: 'Preencha e-mail e senha.' };
  }

  const users = await getUsers();
  const encontrado = users.find((u) => u.email === emailTrim && u.senha === senha);
  if (!encontrado) {
    return { ok: false, error: 'E-mail ou senha incorretos.' };
  }

  const sessao = { nome: encontrado.nome, email: encontrado.email };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
  return { ok: true, user: sessao };
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
