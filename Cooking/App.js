import React, { useEffect, useState } from "react";
import { Linking, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const MainNavigator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("isDarkMode");
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "true");
        }
      } catch (error) {
        console.error("Erro ao recuperar tema:", error);
      }
    };

    getThemePreference();
  }, []);

  const tabBarStyle = {
    backgroundColor: isDarkMode ? "#000" : "#fff",
    borderTopColor: isDarkMode ? "#333" : "#ccc",
  };

  const iconColor = isDarkMode ? "#fff" : "#000";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Receitas"
        component={ReceitaNavigator}
        options={{
          tabBarIcon: () => <Feather name="home" color={iconColor} size={25} />,
        }}
      />
      <Tab.Screen
        name="CriarReceita"
        component={CriarReceita}
        options={{
          tabBarIcon: () => (
            <Feather name="plus-square" size={24} color={iconColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Conta"
        component={Conta}
        options={{
          tabBarIcon: () => <Feather name="user" size={24} color={iconColor} />,
        }}
      />
    </Tab.Navigator>
  );
};

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("isDarkMode");
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "true");
        }
      } catch (error) {
        console.error("Erro ao recuperar tema:", error);
      }
    };

    getThemePreference();
  }, []);



  return (

    <NavigationContainer linking={linking}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />
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
