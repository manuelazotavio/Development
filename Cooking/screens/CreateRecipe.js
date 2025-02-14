import React, { useState,  } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import authFetch from "../helpers/authFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker"; // Usando Expo Image Picker
import AddBtn from "../components/AddBtn";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useUserLoggedStore from "../stores/useUserLoggedStore";

const CreateRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtDescription, setTxtDescription] = useState("");
  const [txtPortion, setTxtPortions] = useState("");
  const [txtTime, setTxtTime] = useState("");
  const [txtRating, setTxtRating] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [image, setImage] = useState(null);

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
  

  const navigation = useNavigation();
  const userId = useUserLoggedStore((state) => state.id);

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

  const postRecipe = async () => {
    try {
      console.log(userId);
      setIsLoading(true);


      const formData = new FormData();


      formData.append("userId", userId);
      formData.append("name", txtName);
      formData.append("description", txtDescription);
      formData.append("portions", txtPortion);
      formData.append("time", txtTime);
      formData.append("rating", Number(txtRating));
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
        "https://backcooking.onrender.com/recipe",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await result.json();
      console.log(data);

      if (data?.success) {
        navigation.navigate("Home");
        Alert.alert("Sucesso", "Receita criada com sucesso!");
      } else {
        if (data.fields) {
          Object.keys(data.fields).forEach((field) => {
            const messages = data.fields[field].messages;

            messages.forEach((message) => {
              Alert.alert("Erro!", `${message}`);
              console.log(`${field}: ${message}`); 
            });
          });
        } else {
          Alert.alert("Erro!", `Não foi possível salvar a receita.`);
        }
      }
    } catch (error) {
      console.log("Error postReceita " + error.message);
    } finally {
      setIsLoading(false); 
    }
  };

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

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <View style={[styles.container, themeStyles]}>
      <ScrollView>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Crie sua receita!
        </Text>
        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="Título da Receita"
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            onChangeText={setTxtName}
            value={txtName}
          />
          <TextInput
            style={[
              styles.inputDesc,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            placeholder="Compartilhe um pouco mais sobre o seu prato. O que você gosta nele?"
            onChangeText={setTxtDescription}
            value={txtDescription}
            multiline
          />

          <Text
            style={[styles.subtitle, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            Ingredientes
          </Text>
          {ingredients.map((ingredient, index) => (
            <TextInput
              placeholderTextColor={isDarkMode ? "#888" : "#666"}
              key={index}
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

          <Text
            style={[styles.subtitle, { color: isDarkMode ? "#fff" : "#000" }]}
          >
            Passo a passo
          </Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionContainer}>
              <Text
                style={[
                  styles.instructionNumber,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {index + 1}.
              </Text>
              <TextInput
                placeholderTextColor={isDarkMode ? "#888" : "#666"}
                style={[
                  styles.inputPasso,
                  {
                    backgroundColor: isDarkMode ? "#333" : "#ededed",
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                placeholder="Misture a massa até se tornar homogênea."
                onChangeText={(text) => handleInstructionChange(text, index)}
                value={instruction}
              />
            </View>
          ))}
          <AddBtn title="Passo" onPress={addInstruction} />

          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Porções</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            placeholder="2 pessoas"
            onChangeText={setTxtPortions}
            value={txtPortion}
          />
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            Tempo de preparo
          </Text>
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
            value={txtRating}
          />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImageChange}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
              <Text style={[styles.avatarText, { color: isDarkMode ? "#fff" : "#000" },]}>
                Escolha uma imagem para a sua receita!
              </Text>
            )}
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator size="large"  color={isDarkMode ? "#fff" : "#000"} />
          ) : (
            <Button title="Publicar" onPress={postRecipe} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "30",
    backgroundColor: "white",
  },
  form: {
    display: "flex",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  input: {
    height: 40,
    width: "100%",
    marginBottom: 18,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  inputDesc: {
    height: 90,
    width: "auto",

    marginBottom: 18,
    padding: 10,
    borderRadius: 10,
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
  inputInstruction: {
    height: 60,
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
    marginLeft: 30,
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
  instructionNumber: {
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {

    fontSize: 16,
    textAlign: "center",
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default CreateRecipe;
