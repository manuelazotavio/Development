import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import logo from '../assets/logo.png'
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";
import CadastrarBtn from "../components/CadastrarBtn";

const ValidToken = ({ route }) => {
  const navigation = useNavigation();
  const { token } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidToken = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://backcooking.onrender.com/auth/verify-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Senha redefinida com sucesso!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao redefinir a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: "#fff", width: "100%", flex: 1 }}>
        <View style={styles.container}>
          <Image style={styles.logo} source={logo}></Image>
          <Text style={styles.titulo}>Escolha sua nova senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <>
              <CadastrarBtn title="Redefinir Senha" onPress={handleValidToken} />
              <Button
                title="Voltar"
                onPress={() => navigation.navigate("EsqueciSenha")}
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

  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center"
  },

  texto: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ValidToken;
