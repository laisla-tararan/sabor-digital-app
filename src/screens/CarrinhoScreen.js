import { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CarrinhoScreen() {
  const { usuario } = useAuth();
  const { itens, adicionar, diminuir, remover, limpar } = useCart();
  const totalEstimado = useMemo(() => itens.reduce((total, item) => total + Number(item.produto.preco) * item.quantidade, 0), [itens]);

  async function finalizarPedido() {
    if (!itens.length) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar.');
      return;
    }

    try {
      const response = await api.post('/pedidos', {
        cliente: usuario.id,
        itens: itens.map((item) => ({ produto_id: item.produto.id, quantidade: item.quantidade })),
      });
      limpar();
      Alert.alert('Pedido enviado', `Pedido #${response.data.pedido?.id || ''} criado com sucesso.`);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.erro || 'Não foi possível criar o pedido.');
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.produto.id)}
        ListEmptyComponent={<Text style={styles.vazio}>Seu carrinho está vazio.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.info}><Text style={styles.nome}>{item.produto.nome}</Text><Text>R$ {Number(item.produto.preco).toFixed(2)}</Text></View>
            <View style={styles.controles}>
              <Pressable onPress={() => diminuir(item.produto.id)}><Text style={styles.controle}>−</Text></Pressable>
              <Text>{item.quantidade}</Text>
              <Pressable onPress={() => adicionar(item.produto)}><Text style={styles.controle}>+</Text></Pressable>
            </View>
            <Pressable onPress={() => remover(item.produto.id)}><Text style={styles.remover}>Remover</Text></Pressable>
          </View>
        )}
      />
      <Text style={styles.total}>Total estimado: R$ {totalEstimado.toFixed(2)}</Text>
      <Text style={styles.observacao}>O total oficial é calculado pela API.</Text>
      <Pressable style={styles.botao} onPress={finalizarPedido}><Text style={styles.textoBotao}>Finalizar pedido</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF8EF' },
  vazio: { textAlign: 'center', marginTop: 40, color: '#6B7280' },
  item: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10 },
  info: { marginBottom: 9 },
  nome: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  controles: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  controle: { color: '#E85D04', fontSize: 25, fontWeight: 'bold' },
  remover: { color: '#B42318', fontWeight: 'bold', marginTop: 8 },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 14 },
  observacao: { color: '#6B7280', marginTop: 5 },
  botao: { backgroundColor: '#E85D04', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  textoBotao: { color: '#FFF', fontWeight: 'bold' },
});
