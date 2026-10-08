import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import api, { BASE_URL } from '../services/api';
import CardProduto from '../components/CardProduto';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function montarUrlImagem(caminho) {
  if (!caminho) return null;
  if (caminho.startsWith('http')) return caminho;
  return `${BASE_URL}${caminho}`;
}

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const { adicionar, quantidadeTotal } = useCart();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregarProdutos = useCallback(async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data.dados || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  if (carregando) return <Text style={styles.mensagem}>Carregando produtos...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View style={styles.flexao}>
          <Text style={styles.titulo}>Olá, {usuario?.nome || 'cliente'}!</Text>
          <Text style={styles.subtitulo}>Escolha seu próximo sabor</Text>
        </View>
        <Pressable onPress={logout}><Text style={styles.sair}>Sair</Text></Pressable>
      </View>

      <View style={styles.acoes}>
        <Pressable style={styles.acao} onPress={() => navigation.navigate('Cardápios')}><Text style={styles.acaoTexto}>Cardápios</Text></Pressable>
        <Pressable style={styles.acao} onPress={() => navigation.navigate('Pedidos')}><Text style={styles.acaoTexto}>Pedidos</Text></Pressable>
        <Pressable style={styles.acao} onPress={() => navigation.navigate('Carrinho')}><Text style={styles.acaoTexto}>Carrinho ({quantidadeTotal})</Text></Pressable>
        {usuario?.papel === 'admin' && <Pressable style={styles.acaoAdmin} onPress={() => navigation.navigate('Administração')}><Text style={styles.acaoTexto}>Admin</Text></Pressable>}
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => { setAtualizando(true); carregarProdutos(); }} />}
        ListEmptyComponent={<Text style={styles.mensagem}>Nenhum produto encontrado.</Text>}
        renderItem={({ item }) => (
          <CardProduto
            produto={item}
            imagem={montarUrlImagem(item.imagem)}
            onPress={() => navigation.navigate('DetalhesProduto', { id: item.id })}
            onAdicionar={() => { adicionar(item); Alert.alert('Carrinho', `${item.nome} foi adicionado.`); }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  topo: { padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flexao: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#252525' },
  subtitulo: { color: '#6B7280', marginTop: 4 },
  sair: { color: '#E85D04', fontWeight: 'bold' },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  acao: { backgroundColor: '#2A9D8F', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 10 },
  acaoAdmin: { backgroundColor: '#252525', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 10 },
  acaoTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  mensagem: { padding: 24, textAlign: 'center', color: '#6B7280' },
});
