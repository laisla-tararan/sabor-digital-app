import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CadastroScreen({ navigation }) {
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('cliente');
  const [enviando, setEnviando] = useState(false);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }

    try {
      setEnviando(true);
      await registrar({ nome: nome.trim(), email: email.trim(), senha, papel });
      Alert.alert('Sucesso', 'Cadastro realizado. Faça login.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.mensagem || 'Não foi possível realizar o cadastro.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <Text style={styles.label}>Tipo de conta</Text>
      <View style={styles.linha}>
        {['cliente', 'admin'].map((opcao) => <Pressable key={opcao} style={[styles.opcao, papel === opcao && styles.opcaoSelecionada]} onPress={() => setPapel(opcao)}><Text>{opcao === 'admin' ? 'Admin' : 'Cliente'}</Text></Pressable>)}
      </View>
      <Pressable style={styles.botao} onPress={cadastrar} disabled={enviando}><Text style={styles.textoBotao}>{enviando ? 'Cadastrando...' : 'Cadastrar'}</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF8EF' },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#252525' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontWeight: 'bold', marginTop: 8, marginBottom: 8 },
  linha: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  opcao: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center' },
  opcaoSelecionada: { backgroundColor: '#FFD6B3', borderWidth: 1, borderColor: '#E85D04' },
  botao: { backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center' },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
});
