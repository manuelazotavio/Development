import { View, Text, StyleSheet } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import { ImageBackground } from "react-native";
import Body from "../components/Body";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AdicionarBtn from "../components/AdicionarBtn";

const Home = () => {
  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    fetchReceitas();
  }, []);

  const fetchReceitas = async () => {
    try {
      const response = await fetch("https://backcooking.onrender.com/receita");
      const data = await response.json();
      setReceitas(data.receita);
      console.log(data.receita);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return <Text>Carregando...</Text>;
  }
  const navigation = useNavigation();

  if (receitas.length === 0) {
    return (
      <View style={styles.containerSplash}>
        <Text style={styles.titulo}>Suas receitas</Text>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Text style={styles.splash}>
            Você ainda não criou nenhuma receita.
          </Text>
          <AdicionarBtn
            title={"Criar"}
            onPress={() => navigation.navigate("CriarReceita")}
          />
          <Text style={styles.tituloFav}>Receitas favoritas</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
    <View style={styles.container}>
      <Text style={styles.titulo}>Suas receitas</Text>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Body />
        <Text style={styles.tituloFav}>Receitas favoritas</Text>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  containerSplash: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
  },
  splash: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  tituloFav: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 10,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
});

export default Home;
