import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CardProduto({ produto, imagem, onPress, onAdicionar }) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress}>
        {imagem ? <Image source={{ uri: imagem }} style={styles.imagem} /> : <View style={styles.semImagem}><Text>Sem imagem</Text></View>}
        <View style={styles.conteudo}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text numberOfLines={2} style={styles.descricao}>{produto.descricao}</Text>
          <Text style={styles.categoria}>{produto.categoria || 'Especialidade da casa'}</Text>
        </View>
      </Pressable>

      <View style={styles.rodape}>
        <Text style={styles.preco}>R$ {Number(produto.preco).toFixed(2)}</Text>
        <Pressable style={styles.adicionar} onPress={onAdicionar}>
          <Text style={styles.textoAdicionar}>Adicionar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', marginHorizontal: 14, marginBottom: 14, borderRadius: 18, overflow: 'hidden', elevation: 3 },
  imagem: { width: '100%', height: 170, backgroundColor: '#EEE' },
  semImagem: { height: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  conteudo: { paddingHorizontal: 16, paddingTop: 14 },
  nome: { fontSize: 19, fontWeight: 'bold', color: '#252525' },
  descricao: { color: '#6B7280', marginTop: 5 },
  categoria: { color: '#2A9D8F', marginTop: 7, fontSize: 12, fontWeight: 'bold' },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  preco: { color: '#E85D04', fontSize: 18, fontWeight: 'bold' },
  adicionar: { backgroundColor: '#E85D04', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  textoAdicionar: { color: '#FFF', fontWeight: 'bold' },
});
