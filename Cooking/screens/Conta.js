import { View, Text, StyleSheet, Image } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

const Conta = () => {
  const navigation = useNavigation();

  const [userLogado, setUserLogado] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("userLogged");
      const user = JSON.parse(userString);
      setUserLogado(user);
    };

    fetchUser();
  }, []);

  console.log(userLogado)
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
     
          <View style={styles.centeredContainer}>
        <Text style={styles.titulo}>Sua conta</Text> 
      
           <Image
          style={styles.profileImage}
          source={require("../assets/user.png")}
        />
        <Text style={styles.name}>Nome de usuário: {userLogado.name}</Text>
        <Text style={styles.name}>E-mail: {userLogado.email}</Text>
        </View>
        <Button style={styles.button} title="Editar" onPress={() => navigation.navigate('EditarUser', {userLogado})}></Button>
        
        <Button  style={styles.button} title="Sair" onPress={handleLogout}></Button>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
  },
  centeredContainer: {
    alignItems: 'center',
  },
 
  button: {
    alignSelf: 'center' 
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
