
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";


const EsqueciSenha = () => {

  const [txtEmail, setTxtEmail] = useState("");

  const navigation = useNavigation();

    const handleEnviarEmail = async () => {
      try {
        const response = await fetch("https://backcooking.onrender.com/auth/redefinir-senha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: txtEmail }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Senha redefinida com sucesso!");
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert("Erro ao redefinir a senha.");
      }
    };
  
    return (
      <View>
        <TextInput
          placeholder="E-mail"
          value={txtEmail}
          onChangeText={setTxtEmail}
        />
        <Text>Um e-mail será enviado para sua caixa de entrada. Verifique os spams.</Text>
        <Button title="Enviar" onPress={handleEnviarEmail} />
        <Button title="Voltar" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  };
  
  export default EsqueciSenha