import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import ListaReceitas from "../components/ListaReceitas";
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Mantendo o useFocusEffect
import AdicionarBtn from "../components/AdicionarBtn";
import authFetch from "../helpers/authFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  useFonts({
    Poppins_900Black,
  });

  const [receitas, setReceitas] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [receitasFiltradas, setReceitasFiltradas] = useState([]); // Para receitas filtradas
  const [searchText, setSearchText] = useState(""); // Texto de pesquisa
  const [receitasFavoritas, setReceitasFavoritas] = useState([]);
  const navigation = useNavigation();

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
      // Recarregar as receitas e as favoritas toda vez que a tela for focada
      fetchReceitas();
      fetchFavoritas(); 
      loadThemePreference();
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
      setReceitasFiltradas(data.receita); // Inicialmente exibe todas as receitas
    } catch (error) {
      navigation.navigate("Login");
      console.error(error);
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

      const favoritosIds = data.favorito.map((fav) => fav.receitaId);

      const receitasFavoritasPromises = favoritosIds.map((id) =>
        authFetch(`https://backcooking.onrender.com/receita/${id}`).then(
          (res) => res.json()
        )
      );

      const receitasData = await Promise.all(receitasFavoritasPromises);
      setReceitasFavoritas(receitasData.map((data) => data.receita));
    } catch (error) {
      console.error(error);
    }
  };

  // Função para atualizar a lista de receitas filtradas com base no texto de pesquisa
  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setReceitasFiltradas(receitas); // Exibe todas se o campo de pesquisa estiver vazio
    } else {
      const filtradas = receitas.filter((receita) =>
        receita.name.toLowerCase().includes(text.toLowerCase())
      );
      setReceitasFiltradas(filtradas);
    }
  };

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme; 

  if (receitas.length === 0) {
    return (
      <View style={[styles.containerSplash, themeStyles]}>
        <View>
          <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>Suas receitas</Text>
          <Text style={[styles.splash, { color: isDarkMode ? "#fff" : "#000" }]}>
            Você ainda não criou nenhuma receita.
          </Text>
          <AdicionarBtn
            title={"Criar"}
            onPress={() => navigation.navigate("CriarReceita")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyles]}>
      <ScrollView>
        <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>Suas receitas</Text>

        {/* Campo de Pesquisa */}
        <TextInput
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#333" : "#ededed",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholder="Pesquisar receitas..."
          value={searchText}
          onChangeText={handleSearch}
        />

        <View>
          {/* Lista de Receitas Filtradas */}
          <ListaReceitas receitas={receitasFiltradas} />

          <Text style={[styles.tituloFav, { color: isDarkMode ? "#fff" : "#000" }]}>Receitas favoritas</Text>
          <ListaReceitas receitas={receitasFavoritas} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   paddingTop: 25,
  
    flex: 1,

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
  input: {
    height: 40,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    marginHorizontal: 30,
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default Home;
