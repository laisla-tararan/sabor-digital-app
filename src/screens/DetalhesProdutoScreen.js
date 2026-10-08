import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import api, { BASE_URL } from '../services/api';

export default function ProductDetailsScreen({ route }) {
  const { id } = route.params;
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
  if (!produto) return <ActivityIndicator style={styles.carregando} size="large" />;

  const imagem = produto.imagem?.startsWith('http' )
    ? produto.imagem
    : produto.imagem
      ? `${BASE_URL}${produto.imagem}`
      : null;

  return (
    <View style={styles.container}>
      {imagem ? <Image source={{ uri: imagem }} style={styles.imagem} /> : null}
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.categoria}>{produto.categoria}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
      <Text style={styles.preco}>R$ {Number(produto.preco).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF8EF' },
  imagem: { width: '100%', height: 240, borderRadius: 18, backgroundColor: '#EEE' },
  nome: { fontSize: 28, fontWeight: 'bold', marginTop: 22 },
  categoria: { color: '#2A9D8F', marginTop: 8 },
  descricao: { color: '#6B7280', fontSize: 16, marginTop: 18, lineHeight: 24 },
  preco: { color: '#E85D04', fontWeight: 'bold', fontSize: 24, marginTop: 22 },
  mensagem: { padding: 24, textAlign: 'center' },
  carregando: { flex: 1 },
});