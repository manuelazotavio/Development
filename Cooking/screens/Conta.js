import { View, Text, StyleSheet, Image } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";

const Conta = () => {
  const [nameUser, setNameUser] = useState("");

  const getAS = async (data) => {
    let dataFound = null;
    try {
      dataFound = await AsyncStorage.getItem(data);
    } catch (error) {
      console.log("Erro ao ler dado");
    }
    return dataFound;
  };

  useEffect(() => {
    const getNome = async () => {
      const nome = await getAS("username");
      setNameUser(nome);
    };

    getNome();
  }, []);

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
      <ImageBackground
        resizeMode="cover"
        source={require("../assets/foodBackground.png")}
        style={styles.bg}
      >
          <View style={styles.centeredContainer}>
        <Text style={styles.titulo}>Sua conta</Text> 
      
           <Image
          style={styles.profileImage}
          source={require("../assets/user.png")}
        />
        <Text style={styles.name}>{nameUser}</Text>
        </View>
        {/* <Button style={styles.button} title="Editar" onPress={handleEdit}></Button> */}
        <Button style={styles.button} title="Sair" onPress={handleLogout}></Button>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  centeredContainer: {
    alignItems: 'center',
  },
  bg: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: 40,
  },
  button: {
    alignSelf: 'flex-start'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    marginBottom: 18,
    padding: 10,
  },
  name: {
    fontWeight: 400
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 25,
    textAlign: "left",
  },
});

export default Conta;
