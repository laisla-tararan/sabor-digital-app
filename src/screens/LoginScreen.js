import { useState } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function entrar() {
        if (!email || !senha) {
        Alert.alert('Atenção', 'Informe e-mail e senha.');
        return;
        }

        try {
        setEnviando(true);
        await login(email, senha);
        } catch (error) {
        console.log(error.response?.data || error.message);
        Alert.alert('Erro', 'E-mail ou senha inválidos.');
        } finally {
        setEnviando(false);
        }
    }

    return (
        <View style={styles.container}>
        <Text style={styles.logo}>Sabor Digital</Text>
        <Text style={styles.subtitulo}>Seu cardápio na palma da mão</Text>

        <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
        />

        <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
        />

        <Pressable style={styles.botao} onPress={entrar} disabled={enviando}>
            <Text style={styles.textoBotao}>
            {enviando ? 'Entrando...' : 'Entrar'}
            </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.link}>Ainda não tenho cadastro</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#FFF8EF',
    },
    logo: {
        color: '#E85D04',
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitulo: {
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    botao: {
        backgroundColor: '#E85D04',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#E85D04',
        textAlign: 'center',
        marginTop: 22,
    },
});