import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import api from '../services/api';

export default function TesteApiScreen( ) {
  const [mensagem, setMensagem] = useState('Testando...');

  useEffect(() => {
    async function testar() {
      try {
        const response = await api.get('/produtos');
        setMensagem(`Conectado. Status: ${response.status}`);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
        setMensagem('Erro de conexão com a API.');
      }
    }

    testar();
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text>{mensagem}</Text>
    </View>
  );
}