import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import ListaReceitas from "../components/ListaReceitas";
import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Mantendo o useFocusEffect
import AdicionarBtn from "../components/AdicionarBtn";
import authFetch from "../helpers/authFetch";

const Home = () => {
  useFonts({
    Poppins_900Black,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [receitas, setReceitas] = useState([]);
  const [receitasFavoritas, setReceitasFavoritas] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Recarregar as receitas e as favoritas toda vez que a tela for focada
      fetchReceitas();
      fetchFavoritas();
    }, [])
  );

  const fetchReceitas = async () => {
    try {
      const result = await authFetch(
        "https://backcooking.onrender.com/receita",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
      setReceitas(data.receita);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchFavoritas = async () => {
    try {
      const result = await authFetch(
        "https://backcooking.onrender.com/favorito",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();

      // Coletando IDs das receitas favoritas
      const favoritosIds = data.favorito.map(fav => fav.receitaId);

      // Agora, busque todas as receitas favoritas com um único fetch usando Promise.all
      const receitasFavoritasPromises = favoritosIds.map(id => 
        authFetch(`https://backcooking.onrender.com/receita/${id}`).then(res => res.json())
      );

      // Aguarde todas as requisições e armazene as receitas favoritas
      const receitasData = await Promise.all(receitasFavoritasPromises);
      setReceitasFavoritas(receitasData.map(data => data.receita));
    } catch (error) {
      console.error(error);
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
          <View> 
            <Text style={styles.titulo}>Suas receitas</Text>
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
      <ScrollView >
        <Text style={styles.titulo}>Suas receitas</Text>
        <View >
          <ListaReceitas receitas={receitas} />
          <Text style={styles.tituloFav}>Receitas favoritas</Text>
          <ListaReceitas receitas={receitasFavoritas} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "30"
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
    justifyContent: "center",
    alignItems: "center",
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
