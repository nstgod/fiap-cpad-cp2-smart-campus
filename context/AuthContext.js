import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authStorage from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sessao = await authStorage.getSession();
      setUser(sessao);
      setLoading(false);
    })();
  }, []);

  const signIn = async ({ email, senha }) => {
    const resultado = await authStorage.loginUser({ email, senha });
    if (resultado.ok) setUser(resultado.user);
    return resultado;
  };

  const signUp = async (dados) => authStorage.registerUser(dados);

  const signOut = async () => {
    await authStorage.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
