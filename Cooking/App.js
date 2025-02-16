import React, { useEffect, useState } from "react";
import { Linking, StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import CreateRecipe from "./screens/CreateRecipe";
import Recipe from "./screens/Recipe";
import SignBtn from "./screens/SignIn";
import EditRecipe from "./screens/EditRecipe";
import Splash from "./screens/Splash";
import Account from "./screens/Account";
import EditUser from "./screens/EditUser";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import ValidToken from "./screens/ValidarToken";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ["exp://192.168.0.125:8081"],
  config: {
    screens: {
      Splash: "splash",
      Login: "login",
      SignIn: "register",
      ForgotPassword: "reset-password",
      ValidToken: "valid-token",
      Main: {
        screens: {
          Home: "home",
          Account: "account",
          CreateRecipe: "create-recipe",
          Recipe: "recipe",
        },
      },
      EditUser: "edit-user",
      EditRecipe: "edit-recipe",
    },
  },
};

const RecipeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Recipe"
      component={Recipe}
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
        name="Recipes"
        component={RecipeNavigator}
        options={{
          tabBarIcon: () => <Feather name="home" color={iconColor} size={25} />,
        }}
      />
      <Tab.Screen
        name="CreateRecipe"
        component={CreateRecipe}
        options={{
          tabBarIcon: () => (
            <Feather name="plus-square" size={24} color={iconColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
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
      subscription.remove();
    };
  }, [navigation]);

  return null;
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
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
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidToken"
          component={ValidToken}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditRecipe"
          component={EditRecipe}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
