import AsyncStorage from '@react-native-async-storage/async-storage';

const RESERVAS_KEY = '@fiap_smart_campus:reservas';
const PEDIDOS_KEY = '@fiap_smart_campus:pedidos';
const CARRINHO_PREFIX = '@fiap_smart_campus:carrinho:';

function gerarId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// =============== RESERVAS DE LABS ===============

export async function getReservas() {
  const raw = await AsyncStorage.getItem(RESERVAS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getReservasDoUsuario(email) {
  if (!email) return [];
  const todas = await getReservas();
  return todas.filter((r) => r.userEmail === email);
}

export async function addReserva({ labId, andar, userEmail }) {
  const todas = await getReservas();
  if (todas.some((r) => r.labId === labId)) {
    return { ok: false, error: 'Este laboratório já está reservado.' };
  }
  const nova = {
    id: gerarId(),
    labId,
    andar,
    userEmail,
    criadaEm: new Date().toISOString(),
  };
  const atualizadas = [...todas, nova];
  await AsyncStorage.setItem(RESERVAS_KEY, JSON.stringify(atualizadas));
  return { ok: true, reserva: nova };
}

export async function removeReserva(id) {
  const todas = await getReservas();
  const atualizadas = todas.filter((r) => r.id !== id);
  await AsyncStorage.setItem(RESERVAS_KEY, JSON.stringify(atualizadas));
  return { ok: true };
}

// =============== CARRINHO DA CANTINA ===============

function chaveCarrinho(email) {
  return `${CARRINHO_PREFIX}${email}`;
}

export async function getCarrinho(email) {
  if (!email) return [];
  const raw = await AsyncStorage.getItem(chaveCarrinho(email));
  return raw ? JSON.parse(raw) : [];
}

export async function setCarrinho(email, itens) {
  if (!email) return;
  await AsyncStorage.setItem(chaveCarrinho(email), JSON.stringify(itens));
}

export async function adicionarItemCarrinho(email, produto) {
  const itens = await getCarrinho(email);
  const idx = itens.findIndex((i) => i.id === produto.id);
  let atualizado;
  if (idx >= 0) {
    atualizado = itens.map((i, n) => (n === idx ? { ...i, qtd: i.qtd + 1 } : i));
  } else {
    atualizado = [...itens, { ...produto, qtd: 1 }];
  }
  await setCarrinho(email, atualizado);
  return atualizado;
}

export async function alterarQuantidadeItem(email, produtoId, delta) {
  const itens = await getCarrinho(email);
  const atualizado = itens
    .map((i) => (i.id === produtoId ? { ...i, qtd: i.qtd + delta } : i))
    .filter((i) => i.qtd > 0);
  await setCarrinho(email, atualizado);
  return atualizado;
}

export async function removerItemCarrinho(email, produtoId) {
  const itens = await getCarrinho(email);
  const atualizado = itens.filter((i) => i.id !== produtoId);
  await setCarrinho(email, atualizado);
  return atualizado;
}

export async function limparCarrinho(email) {
  await setCarrinho(email, []);
}

// =============== PEDIDOS (HISTÓRICO) ===============

export async function getPedidos() {
  const raw = await AsyncStorage.getItem(PEDIDOS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getPedidosDoUsuario(email) {
  if (!email) return [];
  const todos = await getPedidos();
  return todos.filter((p) => p.userEmail === email);
}

export async function addPedido({ userEmail, itens, total, metodoPagamento }) {
  const todos = await getPedidos();
  const novo = {
    id: gerarId(),
    userEmail,
    itens,
    total,
    metodoPagamento,
    criadoEm: new Date().toISOString(),
  };
  const atualizados = [novo, ...todos];
  await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(atualizados));
  return { ok: true, pedido: novo };
}
