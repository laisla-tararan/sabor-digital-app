import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import api, { BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function montarUrlImagem(caminho) {
  if (!caminho) return null;
  if (caminho.startsWith('http' )) return caminho;
  return `${BASE_URL}${caminho}`;
}

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth();
    const { adicionar } = useCart()

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

    function atualizar() {
        setAtualizando(true);
        carregarProdutos();
    }

    if (carregando) return <Text style={styles.mensagem}>Carregando produtos...</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.topo}>
                <View>
                <Text style={styles.titulo}>Olá, seja bem-vindo!</Text>
                <Text style={styles.subtitulo}>Escolha seu próximo sabor</Text>
                </View>
                <Text style={styles.sair} onPress={logout}>Sair</Text>
            </View>

            <FlatList
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} />}
                ListEmptyComponent={<Text style={styles.mensagem}>Nenhum produto encontrado.</Text>}
                renderItem={({ item }) => (
                <ProductCard
                    produto={item}
                    imagem={montarUrlImagem(item.imagem)}
                    onPress={() => navigation.navigate('DetalhesProduto', { id: item.id })}
                    onAdicionar={() => {
                        adicionar(item);
                        Alert.alert(
                            'Carrinho',
                            `${item.nome} foi adicionado ao carrinho.`
                        );
                    }}
                />
                )}
            />
        </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF8EF' },
    topo: { padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#252525' },
    subtitulo: { color: '#6B7280', marginTop: 4 },
    sair: { color: '#E85D04', fontWeight: 'bold' },
    mensagem: { padding: 24, textAlign: 'center', color: '#6B7280' },
});