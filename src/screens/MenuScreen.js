import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function MenusScreen() {
  const [cardapios, setCardapios] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get('/cardapios');
        setCardapios(response.data.dados || []);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os cardápios.');
      }
    }

    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={cardapios}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum cardápio encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text>{item.disponivel ? 'Disponível' : 'Indisponível'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8EF' },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 18, marginBottom: 12 },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#E85D04' },
  descricao: { marginVertical: 8, color: '#6B7280' },
});