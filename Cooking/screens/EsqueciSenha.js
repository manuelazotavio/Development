import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import logo from '../assets/logo.png'
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";

const EsqueciSenha = () => {
  const [txtEmail, setTxtEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleEnviarEmail = async () => {
    try {
      setIsLoading(true);
      const email = txtEmail; // Obtém o e-mail digitado pelo usuário
      const response = await fetch(
        "https://backcooking.onrender.com/auth/redefinir-senha",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }), // Envia como JSON
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Verifique seu e-mail");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao enviar e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ backgroundColor: "#fff", width: "100%", flex: 1 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={logo}></Image>
        <Text style={styles.titulo}>Esqueceu a senha?</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={txtEmail}
          onChangeText={setTxtEmail}
        />
        <Text style={styles.texto}>
          Um e-mail será enviado para sua caixa de entrada. Verifique os spams.
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            <Button title="Enviar" onPress={handleEnviarEmail} />
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
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginBottom: 20
  },
  descricao: {
    paddingVertical: 10,
  },
  texto: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
});
export default EsqueciSenha;
