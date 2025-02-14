import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import ListRecipes from "../components/ListRecipes";
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import AddBtn from "../components/AddBtn";
import authFetch from "../helpers/authFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  useFonts({
    Poppins_900Black,
  });

  const [recipes, setRecipes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState([]); 
  const [searchText, setSearchText] = useState(""); 
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
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
    React.useCallback(() => 
      fetchRecipes();
      fetchFavorites(); 
      loadThemePreference();
    }, [])
  );

 

  const fetchRecipes = async () => {
    try {
      const result = await authFetch(
        "https://backcooking.onrender.com/recipe",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
      setRecipes(data.recipe);
      setFilteredRecipes(data.recipe); 
    } catch (error) {
      navigation.navigate("Login");
      console.error(error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const result = await authFetch(
        "https://backcooking.onrender.com/favorite",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();

      const favoritesIds = data.favorite.map((fav) => fav.recipeId);

      const favoriteRecipesPromises = favoritesIds.map((id) =>
        authFetch(`https://backcooking.onrender.com/recipe/${id}`).then(
          (res) => res.json()
        )
      );

      const recipeData = await Promise.all(favoriteRecipesPromises);
      setFavoriteRecipes(recipeData.map((data) => data.recipe));
    } catch (error) {
      console.error(error);
    }
  };


  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredRecipes(recipes); 
    } else {
      const filtereds = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRecipes(filtereds);
    }
  };

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme; 

  if (recipes.length === 0) {
    return (
      <View style={[styles.containerSplash, themeStyles]}>
        <View>
          <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Suas receitas</Text>
          <Text style={[styles.splash, { color: isDarkMode ? "#fff" : "#000" }]}>
            Você ainda não criou nenhuma receita.
          </Text>
          <AddBtn
            title={"Criar"}
            onPress={() => navigation.navigate("CreateRecipe")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyles]}>
      <ScrollView>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Suas receitas</Text>
    
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
       <ListRecipes recipes={filteredRecipes} />

          <Text style={[styles.titleFav, { color: isDarkMode ? "#fff" : "#000" }]}>Receitas favoritas</Text>
          <ListRecipes recipes={favoritedRecipes} />
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
  title: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 30,
    alignSelf: "flex-start",
  },
  titleFav: {
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
