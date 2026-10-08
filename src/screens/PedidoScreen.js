import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import api from '../services/api';

const statusValidos = [
  'pendente',
  'preparo',
  'pronto',
  'entregue',
];

export default function PedidoScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const response = await api.get('/pedidos');

      const dados = Array.isArray(response.data)
        ? response.data
        : response.data?.dados || [];

      setPedidos(dados);
    } catch (error) {
      console.log(
        'Erro ao carregar pedidos:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os pedidos.',
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function alterarStatus(id, status) {
    try {
      await api.patch(`/pedidos/${id}/status`, {
        status,
      });

      await carregar();

      Alert.alert(
        'Sucesso',
        'Status atualizado com sucesso.',
      );
    } catch (error) {
      console.log(
        'Erro ao alterar status:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Erro',
        error.response?.data?.erro ||
          'Não foi possível alterar o status.',
      );
    }
  }

  function atualizarLista() {
    setAtualizando(true);
    carregar();
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <Text>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        onRefresh={atualizarLista}
        refreshing={atualizando}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhum pedido encontrado.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>
              Pedido #{item.id}
            </Text>

            <Text style={styles.texto}>
              Status:{' '}
              <Text style={styles.status}>
                {item.status || 'pendente'}
              </Text>
            </Text>

            {item.total != null && (
              <Text style={styles.texto}>
                Total: R$ {Number(item.total).toFixed(2)}
              </Text>
            )}

            {Array.isArray(item.itens) && (
              <Text style={styles.texto}>
                Itens: {item.itens.length}
              </Text>
            )}

            <Text style={styles.label}>
              Atualizar status:
            </Text>

            <View style={styles.botoes}>
              {statusValidos.map((status) => (
                <Pressable
                  key={status}
                  style={styles.botaoStatus}
                  onPress={() =>
                    alterarStatus(item.id, status)
                  }
                >
                  <Text style={styles.link}>
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8EF',
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8EF',
  },
  vazio: {
    padding: 24,
    textAlign: 'center',
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#252525',
  },
  texto: {
    marginTop: 5,
    color: '#252525',
  },
  status: {
    color: '#E85D04',
    fontWeight: 'bold',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoStatus: {
    backgroundColor: '#E8F5F3',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 8,
  },
  link: {
    color: '#2A9D8F',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
