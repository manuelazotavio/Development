import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";

const Conta = () => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [userLogado, setUserLogado] = useState(null);

  const fetchUser = async () => {
    const userString = await AsyncStorage.getItem("userLogged");
    const user = JSON.parse(userString);
    setUserLogado(user);
  };

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      setIsDarkMode(storedTheme === "true");
    } catch (error) {
      console.error(error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      loadThemePreference();
    }, [])
  );

  const logout = useUserLoggedStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userLogged");
      logout();
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer logout!");
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <View style={[styles.container, themeStyles]}>
      <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>Sua conta</Text>

      {/* Container da imagem e do ActivityIndicator */}
      <View style={styles.imageContainer}>
        {loadingImage && (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#fff" : "#000"}
            style={styles.activityIndicator}
          />
        )}
        <Image
          style={styles.profileImage}
          source={{ uri: userLogado?.avatar }}
          onLoadEnd={() => setLoadingImage(false)} // Finaliza o carregamento
        />
      </View>

      <Text style={[styles.name, { color: isDarkMode ? "#fff" : "#000" }]}>Nome de usuário: {userLogado?.name}</Text>
      <Text style={[styles.name, { color: isDarkMode ? "#fff" : "#000" }]}>E-mail: {userLogado?.email}</Text>

      <Button
        style={styles.button}
        title="Editar"
        onPress={() => navigation.navigate("EditarUser", { userLogado })}
      ></Button>

      <Button
        style={styles.button}
        title="Sair"
        onPress={handleLogout}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignSelf: "center",
  },
  imageContainer: {
    position: "relative", // Permite a sobreposição
    width: 100,
    height: 100,
    marginBottom: '10'
  },
  activityIndicator: {
    position: "absolute", // Sobrepõe a imagem
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontWeight: "400",
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 25,
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default Conta;
