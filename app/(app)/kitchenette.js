import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FeedbackMessage from '../../components/FeedbackMessage';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, typography } from '../../constants';

const PRODUTOS = [
  {
    id: 'salgado',
    nome: 'Salgado Assado',
    preco: 8,
    imagemUrl: 'https://receitas123.com/wp-content/uploads/2023/04/massa-para-salgado-assado.png',
  },
  {
    id: 'refri',
    nome: 'Refrigerante Lata',
    preco: 6,
    imagemUrl: 'https://imagens.jotaja.com/produtos/78565ea2-23ac-4ef5-91a9-25565ccedda4.jpg',
  },
  {
    id: 'pao',
    nome: 'Pão de Queijo',
    preco: 5,
    imagemUrl: 'https://panutti.com.br/arquivos/produtos/imagens_adicionais/P%C3%A3o%20de%20Queijo-210.jpg',
  },
];

const METODOS = [
  { id: 'PIX', label: 'PIX (Aprovação Imediata)', icon: 'flash-outline' },
  { id: 'CARTAO', label: 'Cartão de Crédito / Débito', icon: 'card-outline' },
  { id: 'SALDO', label: 'Saldo Estudante FIAP', icon: 'wallet-outline' },
];

export default function CantinaScreen() {
  const router = useRouter();
  const { carrinho, pedidos, adicionarItem, alterarQtd, removerItem, criarPedido } = useAppData();
  const { colors } = useTheme();

  const [etapa, setEtapa] = useState('menu');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [processando, setProcessando] = useState(false);

  const qtdItens = carrinho.reduce((acc, i) => acc + i.qtd, 0);
  const total = carrinho.reduce((acc, i) => acc + i.qtd * i.preco, 0);

  const irParaPagamento = () => {
    if (qtdItens > 0) setEtapa('pagamento');
  };

  const confirmarPedido = async () => {
    if (!metodoPagamento) return;
    setProcessando(true);
    await criarPedido(metodoPagamento);
    setProcessando(false);
    setEtapa('sucesso');
  };

  const reiniciar = () => {
    setMetodoPagamento('');
    setEtapa('menu');
  };

  const ItemCard = ({ produto }) => {
    const noCarrinho = carrinho.find((i) => i.id === produto.id);
    return (
      <View
        style={[
          styles.itemCard,
          { backgroundColor: colors.surface, borderLeftColor: colors.primary },
        ]}
      >
        <Image source={{ uri: produto.imagemUrl }} style={styles.itemImage} resizeMode="cover" />
        <View style={styles.itemDetails}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemNome, { color: colors.text }]}>{produto.nome}</Text>
            <Text style={[styles.itemPreco, { color: colors.primary }]}>
              R$ {produto.preco.toFixed(2)}
            </Text>
          </View>
          {noCarrinho ? (
            <View style={styles.qtdControles}>
              <TouchableOpacity
                style={[styles.btnQtd, { backgroundColor: colors.primary }]}
                onPress={() => alterarQtd(produto.id, -1)}
              >
                <Ionicons name="remove" size={16} color="#FFF" />
              </TouchableOpacity>
              <Text style={[styles.qtdNumero, { color: colors.text }]}>{noCarrinho.qtd}</Text>
              <TouchableOpacity
                style={[styles.btnQtd, { backgroundColor: colors.primary }]}
                onPress={() => alterarQtd(produto.id, 1)}
              >
                <Ionicons name="add" size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnRemover} onPress={() => removerItem(produto.id)}>
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.btnAdd, { backgroundColor: colors.primary }]}
              onPress={() => adicionarItem(produto)}
            >
              <Ionicons name="add" size={16} color="#FFF" />
              <Text style={styles.btnTextAdd}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // --- ETAPA 1: MENU ---
  if (etapa === 'menu') {
    return (
      <Screen scroll>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.titulo, { color: colors.primary }]}>Cantina Express</Text>
        </View>
        <Text style={[styles.descricao, { color: colors.textMuted }]}>
          Adicione itens ao carrinho
        </Text>

        {PRODUTOS.map((p) => (
          <ItemCard key={p.id} produto={p} />
        ))}

        <View
          style={[
            styles.carrinhoFooter,
            { backgroundColor: colors.surfaceMuted },
          ]}
        >
          <View>
            <Text style={[styles.carrinhoTexto, { color: colors.textMuted }]}>
              {qtdItens} itens selecionados
            </Text>
            <Text style={[styles.carrinhoTotal, { color: colors.text }]}>
              Total: R$ {total.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.btnPagar,
              { backgroundColor: qtdItens === 0 ? colors.surfaceMuted : colors.success },
              qtdItens === 0 && { opacity: 0.6 },
            ]}
            onPress={irParaPagamento}
            disabled={qtdItens === 0}
          >
            <Text style={styles.btnTextAdd}>PAGAR</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.historicoContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.historicoTitulo, { color: colors.text }]}>Pedidos Anteriores</Text>
          {pedidos.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="Nenhum pedido ainda"
              description="Seus pedidos confirmados aparecerão aqui."
            />
          ) : (
            pedidos.slice(0, 5).map((p) => (
              <View
                key={p.id}
                style={[
                  styles.historicoItem,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <View>
                  <Text style={[styles.historicoTexto, { color: colors.textMuted }]}>
                    {new Date(p.criadoEm).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={[styles.historicoMetodo, { color: colors.text }]}>
                    {p.metodoPagamento}
                  </Text>
                </View>
                <Text style={[styles.historicoTotal, { color: colors.primary }]}>
                  R$ {p.total.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

        <Button
          title="Voltar para Home"
          variant="ghost"
          icon="home-outline"
          onPress={() => router.replace('/home')}
          style={{ marginTop: spacing.md }}
        />
      </Screen>
    );
  }

  // --- ETAPA 2: PAGAMENTO ---
  if (etapa === 'pagamento') {
    return (
      <Screen scroll>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setEtapa('menu')} style={styles.btnVoltar}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.titulo, { color: colors.primary }]}>Pagamento</Text>
        </View>
        <Text style={[styles.descricao, { color: colors.textMuted }]}>
          Total a pagar: R$ {total.toFixed(2)}
        </Text>

        <Text style={[styles.labelPagamento, { color: colors.text }]}>Selecione o método:</Text>

        {METODOS.map((m) => {
          const ativo = metodoPagamento === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.btnMetodo,
                {
                  backgroundColor: ativo ? colors.surface : colors.surfaceMuted,
                  borderColor: ativo ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => setMetodoPagamento(m.id)}
            >
              <Ionicons
                name={m.icon}
                size={22}
                color={ativo ? colors.primary : colors.text}
                style={{ marginRight: spacing.sm }}
              />
              <Text style={[styles.txtMetodo, { color: colors.text }]}>{m.label}</Text>
              {ativo && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
          );
        })}

        <Button
          title="CONFIRMAR PEDIDO"
          icon="checkmark-outline"
          onPress={confirmarPedido}
          disabled={!metodoPagamento}
          loading={processando}
          style={{ marginTop: spacing.md }}
        />

        <Button title="Cancelar e Voltar" variant="ghost" onPress={() => setEtapa('menu')} />
      </Screen>
    );
  }

  // --- ETAPA 3: SUCESSO ---
  return (
    <Screen>
      <View style={styles.successContainer}>
        <View style={styles.successIconWrap}>
          <Ionicons name="checkmark-circle" size={96} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>Pedido Confirmado!</Text>
        <FeedbackMessage
          type="success"
          message={`Pagamento via ${metodoPagamento} aprovado. Retire no balcão express!`}
          style={{ marginTop: spacing.md }}
        />

        <Button
          title="Novo Pedido"
          icon="add-circle-outline"
          onPress={reiniciar}
          style={{ marginTop: spacing.md }}
        />

        <Button
          title="Voltar para Home"
          variant="ghost"
          icon="home-outline"
          onPress={() => router.replace('/home')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  btnVoltar: { padding: spacing.xs, marginRight: spacing.sm },
  titulo: { ...typography.h2 },
  descricao: { ...typography.body, marginBottom: spacing.md },

  itemCard: {
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  itemImage: { width: 70, height: 70, borderRadius: radius.md, marginRight: spacing.md - 2 },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNome: { ...typography.bodyBold },
  itemPreco: { ...typography.bodyBold, marginTop: spacing.xs },

  btnAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: 2,
  },
  btnTextAdd: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  qtdControles: { flexDirection: 'row', alignItems: 'center' },
  btnQtd: {
    width: 32,
    height: 32,
    borderRadius: radius.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtdNumero: {
    ...typography.bodyBold,
    marginHorizontal: spacing.sm + 2,
    minWidth: 18,
    textAlign: 'center',
  },
  btnRemover: { marginLeft: spacing.sm + 2, padding: spacing.xs },

  carrinhoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md + 4,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  carrinhoTexto: { ...typography.caption, fontSize: 14 },
  carrinhoTotal: { ...typography.h3 },
  btnPagar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.md - 4,
    borderRadius: radius.md,
  },

  historicoContainer: {
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  historicoTitulo: { ...typography.h4, marginBottom: spacing.sm + 2 },
  historicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  historicoTexto: { ...typography.caption },
  historicoMetodo: { ...typography.captionBold, marginTop: 2 },
  historicoTotal: { ...typography.bodyBold },

  labelPagamento: {
    ...typography.h4,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  btnMetodo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 4,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  txtMetodo: { ...typography.bodyBold, flex: 1 },

  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successIconWrap: { marginBottom: spacing.md },
  successTitle: { ...typography.h2, textAlign: 'center' },
});
