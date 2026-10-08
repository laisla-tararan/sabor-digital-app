import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function AdminProductsScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  const carregar = useCallback(async () => {
    const response = await api.get('/produtos');
    setProdutos(response.data.dados || []);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregar);
    return unsubscribe;
  }, [navigation, carregar]);

  async function excluir(id) {
    Alert.alert('Excluir produto', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/produtos/${id}`);
            carregar();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.botao} onPress={() => navigation.navigate('NovoProduto')}>
        <Text style={styles.textoBotao}>+ Novo produto</Text>
      </Pressable>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>R$ {Number(item.preco).toFixed(2)}</Text>
            <Pressable onPress={() => excluir(item.id)}>
              <Text style={styles.excluir}>Excluir</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8EF' },
  botao: { backgroundColor: '#E85D04', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 14 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10 },
  nome: { fontWeight: 'bold', fontSize: 17, marginBottom: 5 },
  excluir: { color: '#B42318', fontWeight: 'bold', marginTop: 10 },
});