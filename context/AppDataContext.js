import React, { createContext, useContext, useEffect, useState } from 'react';
import * as data from '../services/dataStorage';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setReservas([]);
      setCarrinho([]);
      setPedidos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [r, c, p] = await Promise.all([
      data.getReservasDoUsuario(user.email),
      data.getCarrinho(user.email),
      data.getPedidosDoUsuario(user.email),
    ]);
    setReservas(r);
    setCarrinho(c);
    setPedidos(p);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [user?.email]);

  const reservarLab = async ({ labId, andar }) => {
    const r = await data.addReserva({ labId, andar, userEmail: user.email });
    if (r.ok) setReservas((atual) => [...atual, r.reserva]);
    return r;
  };

  const cancelarReserva = async (id) => {
    await data.removeReserva(id);
    setReservas((atual) => atual.filter((r) => r.id !== id));
  };

  const adicionarItem = async (produto) => {
    const atual = await data.adicionarItemCarrinho(user.email, produto);
    setCarrinho(atual);
  };

  const alterarQtd = async (produtoId, delta) => {
    const atual = await data.alterarQuantidadeItem(user.email, produtoId, delta);
    setCarrinho(atual);
  };

  const removerItem = async (produtoId) => {
    const atual = await data.removerItemCarrinho(user.email, produtoId);
    setCarrinho(atual);
  };

  const criarPedido = async (metodoPagamento) => {
    const total = carrinho.reduce((acc, i) => acc + i.qtd * i.preco, 0);
    const r = await data.addPedido({
      userEmail: user.email,
      itens: carrinho,
      total,
      metodoPagamento,
    });
    await data.limparCarrinho(user.email);
    setCarrinho([]);
    setPedidos((atual) => [r.pedido, ...atual]);
    return r;
  };

  return (
    <AppDataContext.Provider
      value={{
        reservas,
        carrinho,
        pedidos,
        loading,
        refresh,
        reservarLab,
        cancelarReserva,
        adicionarItem,
        alterarQtd,
        removerItem,
        criarPedido,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData precisa estar dentro de <AppDataProvider>');
  return ctx;
}
