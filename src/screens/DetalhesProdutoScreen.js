import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import api, { BASE_URL } from '../services/api';
import { useCart } from '../context/CartContext';

export default function DetalhesProdutoScreen({ route }) {
  const { id } = route.params;
  const { adicionar } = useCart();
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get(`/produtos/${id}`);
        setProduto(response.data.dados || response.data);
      } catch (error) {
        setErro('Não foi possível carregar o produto.');
      }
    }
    carregar();
  }, [id]);

  if (erro) return <Text style={styles.mensagem}>{erro}</Text>;
  if (!produto) return <ActivityIndicator style={styles.carregando} size="large" color="#E85D04" />;

  const imagem = produto.imagem?.startsWith('http') ? produto.imagem : produto.imagem ? `${BASE_URL}${produto.imagem}` : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imagem ? <Image source={{ uri: imagem }} style={styles.imagem} /> : null}
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.categoria}>{produto.categoria || 'Especialidade da casa'}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
      <Text style={styles.preco}>R$ {Number(produto.preco).toFixed(2)}</Text>
      <Pressable style={styles.botao} onPress={() => { adicionar(produto); Alert.alert('Carrinho', 'Produto adicionado.'); }}>
        <Text style={styles.textoBotao}>Adicionar ao carrinho</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF8EF', flexGrow: 1 },
  imagem: { width: '100%', height: 250, borderRadius: 18, backgroundColor: '#EEE' },
  nome: { fontSize: 29, fontWeight: 'bold', marginTop: 22, color: '#252525' },
  categoria: { color: '#2A9D8F', marginTop: 8, fontWeight: 'bold' },
  descricao: { color: '#6B7280', fontSize: 16, marginTop: 18, lineHeight: 24 },
  preco: { color: '#E85D04', fontWeight: 'bold', fontSize: 24, marginTop: 22 },
  botao: { marginTop: 22, backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center' },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  mensagem: { padding: 24, textAlign: 'center' },
  carregando: { flex: 1 },
});
