import { View, Text, StyleSheet, Image } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const Conta = () => {
  const navigation = useNavigation();

  const [userLogado, setUserLogado] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
     
      const fetchUser = async () => {
        const userString = await AsyncStorage.getItem("userLogged");
        const user = JSON.parse(userString);
        setUserLogado(user);
      };
      fetchUser()
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
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sua conta</Text>

      <Image style={styles.profileImage} source={{ uri: userLogado?.avatar }} />

      <Text style={styles.name}>Nome de usuário: {userLogado.name}</Text>
      <Text style={styles.name}>E-mail: {userLogado.email}</Text>

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
    paddingTop: "50",
  },

  button: {
    alignSelf: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontWeight: 400,
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 25,
  },
});

export default Conta;
