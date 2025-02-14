import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import logo from "../assets/logo.png";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [txtEmail, setTxtEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    
      loadThemePreference();
    }, [])
  );


  const handleSendEmail = async () => {
    try {
      setIsLoading(true);
      const email = txtEmail; 
      const response = await fetch(
        "https://backcooking.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, platform: "expo" }), 
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Verifique seu e-mail");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao enviar e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme; 

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[{ backgroundColor: "#fff", width: "100%", flex: 1 }, themeStyles]}>
        <View style={styles.container}>
          <Image style={styles.logo} source={logo}></Image>
          <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Esqueceu a senha?</Text>
          <TextInput
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="E-mail"
            value={txtEmail}
            onChangeText={setTxtEmail}
          />
          <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>
            Um e-mail será enviado para sua caixa de entrada. Verifique os
            spams.
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
          ) : (
            <>
              <Button title="Enviar" onPress={handleSendEmail} />
              <Button
                title="Voltar"
                onPress={() => navigation.navigate("Login")}
              />
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
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
  button: {
    marginVertical: 10,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    elevation: 2,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    padding: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttonClose: {
    backgroundColor: "#FF421D",
    paddingHorizontal: 30,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins_900Black",
    fontSize: 20,
  },
  title: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginBottom: 20,
  },
  description: {
    paddingVertical: 10,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});
export default ForgotPassword;
