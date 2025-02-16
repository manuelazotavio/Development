import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Pressable,
} from "react-native";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker"; // Usando Expo Image Picker
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const SignIn = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const navigation = useNavigation();

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      setIsDarkMode(storedTheme === "true");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadThemePreference();
    }, [])
  );


  const handleAvatarChange = async () => {
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
      setAvatar(result.assets[0].uri);
    }
  };


  const postUser = async () => {
    setIsLoading(true);
    if (!txtName || !txtEmail || !txtPass || !avatar) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos e selecione um avatar."
      );
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", txtName);
      formData.append("email", txtEmail);
      formData.append("pass", txtPass);
      formData.append("avatar", {
        uri: avatar,
        name: `avatar_${Date.now()}_${txtName}.jpg`,
        type: "image/jpeg",
      });

      const response = await fetch("https://backcooking.onrender.com/user", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data?.success) {
        Alert.alert("Sucesso", "Usuário cadastrado!");
        navigation.goBack(); 
      } else {
        if (response.status === 400) {
          let errorMessage = "";
          for (let field in data.fields) {
            errorMessage += data.fields[field].messages[0] + " ";
          }
          Alert.alert(errorMessage.trim());
        }
      }
    } catch (error) {
      Alert.alert("Erro", error.message, error.name, error.data);
    } finally {
      setIsLoading(false); 
    }
  };

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, themeStyles]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "#000" : "#fff"}
        />
        <Image style={styles.logo} source={logo}></Image>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Cadastrar
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#333" : "#ededed",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholder="Nome..."
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
          onChangeText={setTxtName}
          value={txtName}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#333" : "#ededed",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
          placeholder="Email..."
          onChangeText={setTxtEmail}
          value={txtEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
                paddingRight: 40,
              },
            ]}
            placeholder="Senha"
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            onChangeText={setTxtPass}
            secureTextEntry={!showPassword}
          />
          <Pressable style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              size={20}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </Pressable>
        </View>

        <TouchableOpacity
          style={styles.avatarPicker}
          onPress={handleAvatarChange}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Text
              style={[
                styles.avatarText,
                { color: isDarkMode ? "#aaa" : "#9EA69E" },
              ]}
            >
              Escolha um avatar para seu perfil
            </Text>
          )}
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#fff" : "#000"}
          />
        ) : (
          <>
            <Button title="Cadastrar" onPress={postUser} />
            <Button title="Voltar" onPress={() => navigation.goBack()} />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 5,
  },
  input: {
    height: 40,
    width: "80%",
    backgroundColor: "#ededed",
    marginBottom: 10,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    margin: 0,
    padding: 0,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  avatarPicker: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    color: "#777",
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default SignIn;
