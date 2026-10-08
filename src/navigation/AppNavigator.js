import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import MenusScreen from '../screens/MenusScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) return null;

  return (
    <NavigationContainer>
        <Stack.Navigator>
            {usuario ? (
            <>
                <Stack.Screen name="Início" component={HomeScreen} />
                <Stack.Screen name="DetalhesProduto" component={ProductDetailsScreen} options={{ title: 'Produto' }} />
            </>
            ) : (
            <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Cadastro" component={RegisterScreen} />
            </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  );
}