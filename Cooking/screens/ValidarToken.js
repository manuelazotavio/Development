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
  Pressable
} from "react-native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import CadastrarBtn from "../components/CadastrarBtn";

const ValidToken = ({ route }) => {
  const navigation = useNavigation();
  const { token } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input]}
              placeholder="Senha"
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                size={20}
              
              />
            </Pressable>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <>
              <CadastrarBtn
                title="Redefinir Senha"
                onPress={handleValidToken}
              />
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
    textAlign: "center",
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

  texto: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ValidToken;
