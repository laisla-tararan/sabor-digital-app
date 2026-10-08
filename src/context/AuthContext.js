import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuario');
        const token = await AsyncStorage.getItem('token');

        if (usuarioSalvo && token) {
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch (error) {
        console.log('Erro ao carregar sessão:', error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarSessao();
  }, []);

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario: usuarioRecebido } = response.data;

    if (!token || !usuarioRecebido) {
      throw new Error('Resposta de login inválida. Confira o Swagger.');
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('usuario', JSON.stringify(usuarioRecebido));
    setUsuario(usuarioRecebido);
  }

  async function registrar(dados) {
    return api.post('/auth/registrar', dados);
  }

  async function logout() {
    await AsyncStorage.multiRemove(['token', 'usuario']);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
