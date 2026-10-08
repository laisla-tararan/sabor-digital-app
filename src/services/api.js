import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Celular físico: use o IPv4 do computador na rede Wi-Fi.
// Emulador Android: http://10.0.2.2:3000
// Exemplo: http://192.168.0.15:3000
export const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
