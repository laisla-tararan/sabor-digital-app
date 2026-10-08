import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MenuScreen() {
  const { usuario } = useAuth();
  const [cardapios, setCardapios] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idsProdutos, setIdsProdutos] = useState('');
  const [disponivel, setDisponivel] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const response = await api.get('/cardapios');
      setCardapios(response.data.dados || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os cardápios.');
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function criar() {
    const produtos = idsProdutos.split(',').map((id) => Number(id.trim())).filter(Boolean);
    if (!nome.trim() || !produtos.length) { Alert.alert('Atenção', 'Informe nome e IDs dos produtos, por exemplo: 1,2,3.'); return; }
    try {
      await api.post('/cardapios', { nome: nome.trim(), descricao, disponivel, produtos });
      setNome(''); setDescricao(''); setIdsProdutos('');
      carregar();
      Alert.alert('Sucesso', 'Cardápio criado.');
    } catch (error) { Alert.alert('Erro', error.response?.data?.mensagem || 'Não foi possível criar o cardápio.'); }
  }

  async function excluir(id) {
    try { await api.delete(`/cardapios/${id}`); carregar(); } catch (error) { Alert.alert('Erro', 'Não foi possível excluir o cardápio.'); }
  }

  return (
    <View style={styles.container}>
      {usuario?.papel === 'admin' && <View style={styles.form}>
        <Text style={styles.formTitulo}>Novo cardápio</Text>
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
        <TextInput style={styles.input} placeholder="IDs dos produtos: 1,2,3" value={idsProdutos} onChangeText={setIdsProdutos} keyboardType="numbers-and-punctuation" />
        <View style={styles.linha}><Text>Disponível</Text><Switch value={disponivel} onValueChange={setDisponivel} /></View>
        <Pressable style={styles.botao} onPress={criar}><Text style={styles.textoBotao}>Criar cardápio</Text></Pressable>
      </View>}
      <FlatList data={cardapios} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text>Nenhum cardápio encontrado.</Text>} renderItem={({ item }) => <View style={styles.card}><Text style={styles.nome}>{item.nome}</Text><Text style={styles.descricao}>{item.descricao}</Text><Text>{item.disponivel ? 'Disponível' : 'Indisponível'}</Text>{usuario?.papel === 'admin' && <Pressable onPress={() => excluir(item.id)}><Text style={styles.excluir}>Excluir</Text></Pressable>}</View>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8EF' },
  form: { backgroundColor: '#FFEBD7', padding: 14, borderRadius: 14, marginBottom: 14 },
  formTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  botao: { backgroundColor: '#E85D04', padding: 13, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 18, marginBottom: 12 },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#E85D04' },
  descricao: { marginVertical: 8, color: '#6B7280' },
  excluir: { color: '#B42318', fontWeight: 'bold', marginTop: 10 },
});
