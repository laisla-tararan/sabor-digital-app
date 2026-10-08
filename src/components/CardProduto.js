import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ProductCard({
    produto,
    imagem,
    onPress,
    onAdicionar,
    }) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
        {imagem && (
            <Image
            source={{ uri: imagem }}
            style={styles.imagem}
            />
        )}

        <View style={styles.conteudo}>
            <Text style={styles.nome}>{produto.nome}</Text>

            <Text
            numberOfLines={2}
            style={styles.descricao}
            >
            {produto.descricao}
            </Text>

            <View style={styles.rodape}>
            <Text style={styles.preco}>
                R$ {Number(produto.preco).toFixed(2)}
            </Text>

            <Pressable
                style={styles.adicionar}
                onPress={onAdicionar}
            >
                <Text style={styles.textoAdicionar}>
                Adicionar
                </Text>
            </Pressable>
            </View>
        </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        margin: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
    },
    imagem: {
        width: '100%',
        height: 170,
        backgroundColor: '#EEEEEE',
    },
    conteudo: {
        padding: 15,
    },
    nome: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#252525',
    },
    descricao: {
        color: '#6B7280',
        marginTop: 5,
    },
    rodape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },
    preco: {
        color: '#E85D04',
        fontSize: 18,
        fontWeight: 'bold',
    },
    adicionar: {
        backgroundColor: '#E85D04',
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 9,
    },
    textoAdicionar: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});