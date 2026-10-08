import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import DetalhesProdutoScreen from '../screens/DetalhesProdutoScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import PedidoScreen from '../screens/PedidoScreen';
import MenuScreen from '../screens/MenuScreen';
import ProdutoAdmin from '../screens/ProdutoAdmin';
import CadastroProdutoScreen from '../screens/CadastroProdutoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#E85D04',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen name="Início" component={HomeScreen} />
            <Stack.Screen name="DetalhesProduto" component={DetalhesProdutoScreen} options={{ title: 'Produto' }} />
            <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
            <Stack.Screen name="Pedidos" component={PedidoScreen} />
            <Stack.Screen name="Cardápios" component={MenuScreen} />
            <Stack.Screen name="Administração" component={ProdutoAdmin} />
            <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} options={{ title: 'Produto' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
