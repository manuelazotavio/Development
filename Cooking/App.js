import React, { useEffect } from "react";
import { Linking, StatusBar } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import CriarReceita from "./screens/CriarReceita";
import Receita from "./screens/Receita";
import Cadastrar from "./screens/Cadastrar";
import EditarReceita from "./screens/EditarReceita";
import Splash from "./screens/Splash";
import Conta from "./screens/Conta";
import EditarUser from "./screens/EditarUser";
import Home from "./screens/Home";
import Login from "./screens/Login";
import EsqueciSenha from "./screens/EsqueciSenha";
import ValidToken from "./screens/ValidarToken";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configuração de deep linking
const linking = {
  prefixes: ["exp://192.168.0.125:8081"],
  config: {
    screens: {
      Splash: "splash",
      Login: "login",
      Cadastrar: "register",
      EsqueciSenha: "reset-password",
      ValidToken: "valid-token",
      Main: {
        screens: {
          Home: "home",
          Conta: "account",
          CriarReceita: "create-recipe",
          Receita: "recipe",
        },
      },
      EditarUser: "edit-user",
      EditarReceita: "edit-recipe",
    },
  },
};

// Navigator principal para rotas tabuladas
const ReceitaNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Receita"
      component={Receita}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Receitas"
      component={ReceitaNavigator}
      options={{
        tabBarIcon: () => <Feather name="home" color="#000" size={25} />,
      }}
    />
    <Tab.Screen
      name="CriarReceita"
      component={CriarReceita}
      options={{
        tabBarIcon: () => (
          <Feather name="plus-square" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Conta"
      component={Conta}
      options={{
        tabBarIcon: () => <Feather name="user" size={24} color="black" />,
      }}
    />
  </Tab.Navigator>
);

const DeepLinkHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const route = url.split("?")[0];
      const params = new URLSearchParams(url.split("?")[1]);

      if (route.includes("valid-token")) {
        const token = params.get("token");
        navigation.navigate("ValidToken", { token });
      }
    };

    const subscription = Linking.addListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove(); // Remove a assinatura ao desmontar o componente
    };
  }, [navigation]);

  return null;
};


// App principal
const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <DeepLinkHandler />
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastrar"
          component={Cadastrar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidToken"
          component={ValidToken}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EsqueciSenha"
          component={EsqueciSenha}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditarUser"
          component={EditarUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditarReceita"
          component={EditarReceita}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
