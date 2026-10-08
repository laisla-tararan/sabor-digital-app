import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import api from '../services/api';

export default function ProductFormScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [imagem, setImagem] = useState(null);

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0]);
    }
  }

  async function salvar() {
    if (!nome || !preco) {
      Alert.alert('Atenção', 'Nome e preço são obrigatórios.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', String(preco).replace(',', '.'));
    formData.append('categoria', categoria);
    formData.append('disponivel', String(disponivel));

    if (imagem) {
      formData.append('imagem', {
        uri: imagem.uri,
        name: imagem.fileName || 'produto.jpg',
        type: imagem.mimeType || 'image/jpeg',
      });
    }

    try {
      await api.post('/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Sucesso', 'Produto cadastrado.');
      navigation.goBack();
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Categoria" value={categoria} onChangeText={setCategoria} />

      <View style={styles.linha}>
        <Text>Disponível</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} />
      </View>

      <Pressable style={styles.secundario} onPress={escolherImagem}>
        <Text>Escolher imagem</Text>
      </Pressable>

      {imagem && <Image source={{ uri: imagem.uri }} style={styles.preview} />}

      <Pressable style={styles.botao} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar produto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8EF' },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 12 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secundario: { backgroundColor: '#FFD6B3', padding: 14, borderRadius: 10, alignItems: 'center' },
  preview: { height: 180, borderRadius: 12, marginVertical: 14 },
  botao: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center' },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
});