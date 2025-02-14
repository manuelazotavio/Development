import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button.js";
import { useState } from "react";
import React from "react";
import AddBtn from "../components/AdicionarBtn.js";
import * as ImagePicker from "expo-image-picker"; 
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useUserLoggedStore from "../stores/useUserLoggedStore.js";
import authFetch from "../helpers/authFetch.js";

const EditRecipe = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userId = useUserLoggedStore((state) => state.id);
  const [isLoading, setIsLoading] = useState(false);

  const { recipe } = route.params;

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (text, index) => {
    const newInstruction = [...instructions];
    newInstruction[index] = text;
    setInstructions(newInstruction);
  };
  const [loadingImage, setLoadingImage] = useState(true);
  const [txtName, setTxtName] = useState(recipe.name);
  const [txtDescription, setTxtDescription] = useState(recipe.descricao);
  const [image, setImage] = useState(recipe.image);
  const [txtPortion, setTxtPortion] = useState(recipe.portions);
  const [txtTime, setTxtTime] = useState(recipe.time);
  const [txtRating, setTxtRating] = useState(recipe.rating);
  const [ingredients, setIngredients] = useState(
    recipe.ingredients.split(";")
  );
  const [instructions, setInstructions] = useState(recipe.instructions.split(";"));

  const [isDarkMode, setIsDarkMode] = useState(false);

  const getThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === "true");
      }
    } catch (error) {
      console.error("Erro ao recuperar tema:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getThemePreference();
    }, [])
  );

  const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 1, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const editRecipe = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {

      const formData = new FormData();

      setIsLoading(true)

      formData.append("name", txtName);
      formData.append("description", txtDescription);
      formData.append("portion", txtPortion);
      formData.append("time", txtTime);
      formData.append("rating", parseInt(txtRating));
      formData.append(
        "ingredients",
        ingredients.filter((ingredient) => ingredient !== "").join(";")
      );
      formData.append(
        "instruction",
        instructions.filter((instruction) => instruction !== "").join(";")
      );

      formData.append("image", {
        uri: image,
        name: `image_${Date.now()}_${userId}.jpg`,
        type: "image/jpeg",
      });
      const result = await authFetch(
        "https://backcooking.onrender.com/receita/" + recipe.id,
        {
          method: "PUT",
          body: formData,
        }
      );
      console.log(result);
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        Alert.alert("Sucesso", "Receita editada com sucesso!");
        navigation.navigate("Main");
      } else {
        Alert.alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      Alert.alert(error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <View style={[styles.container, themeStyles]}>
      <ScrollView>
        <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>Edite sua receita!</Text>
        <View style={styles.form}>
          <TextInput
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="Título da Receita"
            onChangeText={setTxtName}
            value={txtName}
          />
          <TextInput
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.inputDesc,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="Compartilhe um pouco mais sobre o seu prato. O que você gosta nele?"
            onChangeText={setTxtDescription}
            value={txtDescription}
            multiline
          />

          <Text style={[styles.subtitle, { color: isDarkMode ? "#fff" : "#000" }]}>Ingredientes</Text>
          {ingredients.map((ingredient, index) => (
            <TextInput
              key={index}
              placeholderTextColor={isDarkMode ? "#888" : "#666"}
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#333" : "#ededed",
                  color: isDarkMode ? "#fff" : "#000",
                },
              ]}
              placeholder="250g de açúcar"
              onChangeText={(text) => handleIngredientChange(text, index)}
              value={ingredient}
            />
          ))}
          <AddBtn title="Ingrediente" onPress={addIngredient} />

          <Text style={[styles.subtitle, { color: isDarkMode ? "#fff" : "#000" }]}>Passo a passo</Text>
          {instructions.map((passo, index) => (
            <View key={index} style={styles.instructionContainer}>
              <Text style={[
                  styles.instructionNumber,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}>{index + 1}.</Text>
              <TextInput
              placeholderTextColor={isDarkMode ? "#888" : "#666"}
              style={[
                styles.inputInstruction,
                {
                  backgroundColor: isDarkMode ? "#333" : "#ededed",
                  color: isDarkMode ? "#fff" : "#000",
                },
              ]}
                placeholder="Misture a massa até se 
tornar homogênea."
                onChangeText={(text) => handleInstructionChange(text, index)}
                value={instruction}
              />
            </View>
          ))}
          <AddBtn title="Passo" onPress={addInstruction} />

          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Porções</Text>
          <TextInput
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="2 pessoas"
            onChangeText={setTxtPortion}
            value={txtPortion}
          />
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Tempo de preparo</Text>
          <TextInput
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="1h e 30min"
            onChangeText={setTxtTime}
            value={txtTime}
          />

          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Avaliação</Text>
          <TextInput
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="4.5"
            onChangeText={setTxtRating}
            value={String(txtRating)}
          />
          <TouchableOpacity
            style={styles.avatarPicker}
            onPress={handleImageChange}
          >
            {loadingImage && (
              <ActivityIndicator
                size="small"
                color={isDarkMode ? "#fff" : "#000"}
                style={styles.imgLoading}
              />
            )}
            <Image
              onLoad={() => setLoadingImage(false)}
              onError={() => setLoadingImage(false)}
              source={{ uri: image }}
              style={styles.avatar}
            />
            <FontAwesomeIcon style={[styles.pencil, { backgroundColor: isDarkMode ? "#000" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} icon={faPencil} size={22} />
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
          ) : (
            <>
              <Button title="Cancelar" onPress={() => navigation.goBack()} />
              <Button title="Salvar" onPress={editRecipe} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "40",
    paddingBottom: "30",
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#ededed",
    marginBottom: 18,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  inputDesc: {
    height: 90,
    width: "auto",
    backgroundColor: "#ededed",
    marginBottom: 18,
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  avatarText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  imgLoading: {
    position: "absolute",
    top: 70,
    right: 143,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
  },
  pencil: {
    position: "absolute",
    top: 100,
    right: 120,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
  },
  inputInstruction: {
    height: 60,
    width: "auto",
    backgroundColor: "#ededed",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    flex: 1,
  },
  title: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontFamily: "Poppins_900Black",
    fontSize: 20,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPicker: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 20,
  },
  instructionNumber: {
    width: 30,
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default EditRecipe;
