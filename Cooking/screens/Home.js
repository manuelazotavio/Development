import { View, Text, StyleSheet } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import { ImageBackground } from "react-native";
import Body from "../components/Body";
import React, { useState, useEffect } from "react";
import Splash from "../components/Splash";

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
      console.log(data.receita)
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

  if (receitas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Suas receitas</Text>
        <Text>Você não tem nenhuma receita cadastrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Suas receitas</Text>
      <Body />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
});

export default Home;
