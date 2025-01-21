
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import Button from "../components/Button";


const ValidToken = ({ route }) => {
    const { token } = route.params;
    const [newPassword, setNewPassword] = useState("");
  
    const handleValidToken = async () => {
      try {
        const response = await fetch("https://backcooking.onrender.com/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
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
          placeholder="Nova senha"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button title="Redefinir Senha" onPress={handleResetPassword} />
      </View>
    );
  };
  
  export default ValidToken