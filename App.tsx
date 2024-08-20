import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';

// Definindo os tipos de rotas disponíveis
type RootStackParamList = {
  Login: undefined;
  Home: { userName: string }; // Modificado para aceitar o nome do usuário como parâmetro
};

// Definindo o tipo de `navigation` para a LoginScreen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('Conectado ao backend');
  
  // Definindo corretamente o tipo da ref como Animatable.View
  const formRef = useRef<Animatable.View & View>(null);

  useEffect(() => {
    console.log('formRef current:', formRef.current); // Verifique se o formRef está corretamente atribuído
  }, []);

  const handleLogin = () => {
    console.log('Tentativa de login com:', { email, password });
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha no login');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Resposta do servidor:', data);
        Alert.alert('Login realizado com sucesso!');
        // Passa o nome do usuário para a HomeScreen
        navigation.navigate('Home', { userName: data.name });
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error);
        triggerErrorAnimation(); // Chama a animação de erro
        Alert.alert('Erro ao fazer login');
      });
  };

  const triggerErrorAnimation = () => {
    if (formRef.current) {
      console.log('Disparando animação de shake');
      formRef.current?.shake?.(800);  // O operador ?. garante que o método shake só será chamado se formRef.current não for undefined
    } else {
      console.log('formRef está vazio');
    }
  };

  return (
    <Animatable.View
      ref={formRef}  // Define a referência para o formRef
      style={styles.container}
    >
      <Text style={styles.title}>WealthWise Login</Text>
      <Text style={styles.status}>{statusMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder="email@exemplo.com"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

function HomeScreen({ route }: { route: { params: { userName: string } } }) {
  const { userName } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à WealthWise, {userName}!</Text>
    </View>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  status: {
    color: 'green',
    marginBottom: 20,
  },
  input: {
    width: '40%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
