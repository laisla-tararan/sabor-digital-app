import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import api from "../services/api";

export default function OrdersScreen() {
  const [pedidos, setPedidos] = useState([]);

  const carregar = useCallback(async () => {
    try {
      const response = await api.get("/pedidos");
      setPedidos(
        Array.isArray(response.data)
          ? response.data
          : response.data.dados || [],
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pedidos.");
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function alterarStatus(id, status) {
    try {
      await api.patch(`/pedidos/${id}/status`, { status });
      carregar();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status.");
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum pedido encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>Pedido #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            {item.total != null && (
              <Text>Total: R$ {Number(item.total).toFixed(2)}</Text>
            )}
            <View style={styles.botoes}>
              <Pressable onPress={() => alterarStatus(item.id, "preparo")}>
                <Text style={styles.link}>Preparo</Text>
              </Pressable>
              <Pressable onPress={() => alterarStatus(item.id, "pronto")}>
                <Text style={styles.link}>Pronto</Text>
              </Pressable>
              <Pressable onPress={() => alterarStatus(item.id, "entregue")}>
                <Text style={styles.link}>Entregue</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFF8EF" },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  titulo: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  botoes: { flexDirection: "row", gap: 18, marginTop: 14 },
  link: { color: "#E85D04", fontWeight: "bold" },
});
