import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Text,
} from "react-native";
import Button from "../components/Button.js";
import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "../stores/userStore.js";
import authFetch from "../helpers/authFetch.js";

const EditarUser = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const removeUserStore = useUserStore((state) => state.removeUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const { userLogado } = route.params;
  const userId = userLogado.id;

  const [txtName, setTxtName] = useState(userLogado.name);
  const [txtEmail, setTxtEmail] = useState(userLogado.email);
  const [avatar, setAvatar] = useState(userLogado.avatar);

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
      allowsEditing: true, // Permite edição básica da imagem
      aspect: [1, 1], // Define a proporção (ex.: quadrado)
      quality: 1, // Qualidade máxima da imagem
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const editUser = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {

      const formData = new FormData();
      formData.append("name", txtName);
      formData.append("email", txtEmail);
      formData.append("avatar", {
        uri: avatar,
        name: `avatar_${Date.now()}_${userId}.jpg`,
        type: "image/jpeg",
      });

      const result = await authFetch(
        "https://backcooking.onrender.com/user/" + userId,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!result.ok) {
        const dataError = await result.json();
        if (
          dataError?.error &&
          dataError?.code &&
          dataError.code === "logout"
        ) {
          alert("Sessão expirada!");
          navigation.navigate("Login");
          return;
        }
      }
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        //update do user na store com o data.user
        await AsyncStorage.setItem("userLogged", JSON.stringify(data.user));
        updateUser(data.user);
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      alert(error.message);
    }
  };

  const removeUser = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      const result = await authFetch(
        "https://backcooking.onrender.com/user/" + userId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!result.ok) {
        const dataError = await result.json();
        if (
          dataError?.error &&
          dataError?.code &&
          dataError.code === "logout"
        ) {
          alert("Sessão expirada!");
          navigation.navigate("Login");
          return;
        }
      }
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        removeUserStore(userId);
        navigation.navigate("Splash");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error removeUser " + error.message);
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Editar</Text>
        <View style={styles.form}>
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
          <TouchableOpacity
            style={styles.avatarPicker}
            onPress={handleAvatarChange}
          >
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </TouchableOpacity>
          <Text style={styles.avatarText}>Clique na imagem para alterá-la</Text>
        </View>

        <Button title="Cancelar" onPress={() => navigation.navigate("Conta")} />
        <Button title="Salvar" onPress={editUser} />

        <Button title="Apagar conta" onPress={removeUser} />
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#ededed",
    marginBottom: 10,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  avatarPicker: {
    alignItems: "center",
    justifyContent: "center",
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

  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
});

export default EditarUser;
