import { NavigationContainer, useNavigation } from "@react-navigation/native";
import CriarReceita from "./screens/CriarReceita";
import { Feather } from "@expo/vector-icons";
import Receita from "./screens/Receita";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import Cadastrar from "./screens/Cadastrar";
import EditarReceita from "./screens/EditarReceita";
import { StatusBar } from "react-native";
import Splash from "./screens/Splash";
import Conta from "./screens/Conta";
import EditarUser from "./screens/EditarUser";
import Home from "./screens/Home";
import Login from "./screens/Login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EsqueciSenha from "./screens/EsqueciSenha";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ReceitaNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Receita"
        component={Receita}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
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
          tabBarIcon: () => (
            <Feather name="home" color="#000" size={25} />
          ),
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
};

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <DeepLinkHandler />
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Cadastrar"
          component={Cadastrar}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EsqueciSenha"
          component={EsqueciSenha}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditarUser"
          component={EditarUser}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditarReceita"
          component={EditarReceita}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Componente separado para lidar com deep links
const DeepLinkHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const route = url.split("?")[0];
      const params = new URLSearchParams(url.split("?")[1]);

      if (route === "myapp://reset-password") {
        const token = params.get("token");
        navigation.navigate("ResetPassword", { token });
      }
    };

    // Listener para deep links
    Linking.addEventListener("url", handleDeepLink);

    // Listener para links ao abrir o app pela primeira vez
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, [navigation]);

  return null;
};

export default App;
