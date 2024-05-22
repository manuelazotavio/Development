import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import Body from "../components/Body";
import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import AdicionarBtn from "../components/AdicionarBtn";
import authFetch from "../helpers/authFetch";

const Home = () => {
  useFonts({
    Poppins_900Black,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [receitas, setReceitas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  console.log("favoritas:", favoritas);

  const navigation = useNavigation();

  useEffect(() => {
    fetchReceitas();
    fetchFavoritas();
  }, []);

  const fetchFavoritas = async () => {
    try {
      const response = await authFetch(
        "https://backcooking.onrender.com/favorito",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data.favorito);
      setFavoritas(data.favorito);

      // Fetch each favorite recipe
      data.favorito.forEach(async (favorita) => {
        try {
          const response = await authFetch(
            `https://backcooking.onrender.com/receita/${favorita.receitaId}`
          );
          const data = await response.json();
          setFavoritas((prevFavoritas) => [...prevFavoritas, data.receita]);
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReceitas = async () => {
    try {
      const response = await fetch("https://backcooking.onrender.com/receita");
      const data = await response.json();
      setReceitas(data.receita);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.containerLoading}>
        <Image source={require("../assets/loading.gif")} />
      </View>
    );
  }

  if (receitas.length === 0) {
    return (
      <View style={styles.containerSplash}>
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <Text style={styles.titulo}>Suas receitas</Text>
          <View style={{ backgroundColor: "white" }}>
            <Text style={styles.splash}>
              Você ainda não criou nenhuma receita.
            </Text>
            <AdicionarBtn
              title={"Criar"}
              onPress={() => navigation.navigate("CriarReceita")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "flex-start" }}>
        <Text style={styles.titulo}>Suas receitas</Text>
        <View style={{ backgroundColor: "white" }}>
          <Body />
          <Text style={styles.tituloFav}>Receitas favoritas</Text>
          {favoritas.map((favorita, index) => {
  const isFavorite = receitas.some(receita => receita.id === favorita.id);
  if (isFavorite) {
    return <Body key={index} receita={favorita} />;
  }
  return null;
})}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff082",
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
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
    marginLeft: 30,
    alignSelf: "flex-start",
  },
  tituloFav: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 10,
    marginLeft: 30,
    alignSelf: "flex-start",
  },
});

export default Home;
