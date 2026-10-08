import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import api from '../services/api';

export default function CadastroProdutoScreen({ route, navigation }) {
  const produtoExistente = route.params?.produto;
  const editando = Boolean(produtoExistente);
  const [nome, setNome] = useState(produtoExistente?.nome || '');
  const [descricao, setDescricao] = useState(produtoExistente?.descricao || '');
  const [preco, setPreco] = useState(produtoExistente?.preco ? String(produtoExistente.preco) : '');
  const [categoria, setCategoria] = useState(produtoExistente?.categoria || '');
  const [disponivel, setDisponivel] = useState(produtoExistente?.disponivel ?? true);
  const [imagem, setImagem] = useState(null);

  useEffect(() => { navigation.setOptions({ title: editando ? 'Editar produto' : 'Novo produto' }); }, [editando, navigation]);

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!resultado.canceled) setImagem(resultado.assets[0]);
  }

  async function salvar() {
    if (!nome.trim() || !descricao.trim() || !preco) { Alert.alert('Atenção', 'Nome, descrição e preço são obrigatórios.'); return; }
    const formData = new FormData();
    formData.append('nome', nome.trim()); formData.append('descricao', descricao.trim()); formData.append('preco', String(preco).replace(',', '.')); formData.append('categoria', categoria); formData.append('disponivel', String(disponivel));
    if (imagem) formData.append('imagem', { uri: imagem.uri, name: imagem.fileName || 'produto.jpg', type: imagem.mimeType || 'image/jpeg' });
    try {
      await api[editando ? 'put' : 'post'](editando ? `/produtos/${produtoExistente.id}` : '/produtos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Sucesso', editando ? 'Produto atualizado.' : 'Produto cadastrado.');
      navigation.goBack();
    } catch (error) { console.log(error.response?.data || error.message); Alert.alert('Erro', error.response?.data?.mensagem || 'Não foi possível salvar o produto.'); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={[styles.input, styles.multiline]} placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Categoria" value={categoria} onChangeText={setCategoria} />
      <View style={styles.linha}><Text>Disponível</Text><Switch value={disponivel} onValueChange={setDisponivel} /></View>
      <Pressable style={styles.secundario} onPress={escolherImagem}><Text>Escolher imagem JPG/PNG</Text></Pressable>
      {imagem && <Image source={{ uri: imagem.uri }} style={styles.preview} />}
      <Pressable style={styles.botao} onPress={salvar}><Text style={styles.textoBotao}>{editando ? 'Salvar alterações' : 'Salvar produto'}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#FFF8EF', flexGrow: 1 },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 12 },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secundario: { backgroundColor: '#FFD6B3', padding: 14, borderRadius: 10, alignItems: 'center' },
  preview: { height: 180, borderRadius: 12, marginVertical: 14 },
  botao: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
});
