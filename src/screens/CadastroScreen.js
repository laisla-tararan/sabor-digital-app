import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('cliente');

  async function cadastrar() {
    try {
        await registrar({ nome, email, senha, papel });
        Alert.alert('Sucesso', 'Cadastro realizado. Faça login.', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    } catch (error) {
        console.log(error.response?.data || error.message);
        Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  }

  return (
    <View style={styles.container}>
        <Text style={styles.titulo}>Criar conta</Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

        <Text style={styles.label}>Tipo de conta</Text>
        <View style={styles.linha}>
            <Pressable style={[styles.opcao, papel === 'cliente' && styles.opcaoSelecionada]} onPress={() => setPapel('cliente')}>
            <Text>Cliente</Text>
            </Pressable>
            <Pressable style={[styles.opcao, papel === 'admin' && styles.opcaoSelecionada]} onPress={() => setPapel('admin')}>
            <Text>Admin</Text>
            </Pressable>
        </View>

        <Pressable style={styles.botao} onPress={cadastrar}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF8EF' },
    titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#252525' },
    input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12 },
    label: { fontWeight: 'bold', marginTop: 8, marginBottom: 8 },
    linha: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    opcao: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center' },
    opcaoSelecionada: { backgroundColor: '#FFD6B3', borderWidth: 1, borderColor: '#E85D04' },
    botao: { backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center' },
    textoBotao: { color: '#FFF', fontWeight: 'bold' },
});