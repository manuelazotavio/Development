import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Usando Expo Image Picker
import { useNavigation } from "@react-navigation/native";

const Cadastrar = () => {
  const [avatar, setAvatar] = useState(null);
  const [txtName, setTxtName] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const navigation = useNavigation();

  // Função para selecionar imagem
  const handleAvatarChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Permite edição básica da imagem
      aspect: [1, 1], // Define a proporção (ex.: quadrado)
      quality: 1, // Qualidade máxima da imagem
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Função para enviar os dados
  const postUser = async () => {
    if (!txtName || !txtEmail || !txtPass || !avatar) {
      Alert.alert("Erro", "Por favor, preencha todos os campos e selecione um avatar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", txtName);
      formData.append("email", txtEmail);
      formData.append("pass", txtPass);
      formData.append("avatar", {
        uri: avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      const response = await fetch("https://backcooking.onrender.com/user", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data?.success) {
        Alert.alert("Sucesso", "Usuário cadastrado!");
        navigation.goBack(); // Volta para a tela anterior
      } else {
        Alert.alert("Erro", data.message || "Ocorreu um erro no cadastro.");
      }
    } catch (error) {
      Alert.alert("Erro", error.message, error.name, error.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome..."
        onChangeText={setTxtName}
        value={txtName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email..."
        onChangeText={setTxtEmail}
        value={txtEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha..."
        secureTextEntry
        onChangeText={setTxtPass}
        value={txtPass}
      />
      <TouchableOpacity style={styles.avatarPicker} onPress={handleAvatarChange}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>Escolha um avatar para seu perfil</Text>
        )}
      </TouchableOpacity>
      <Button title="Cadastrar" onPress={postUser} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
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
});

export default Cadastrar;
