import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  Switch,
  StatusBar
} from "react-native";
import Button from "../components/Button.js";
import { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useUserStore from "../stores/userStore.js";
import useUserLoggedStore from "../stores/useUserLoggedStore.js";
import authFetch from "../helpers/authFetch.js";

const EditUser = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const removeUserStore = useUserStore((state) => state.removeUser);
  const logout = useUserLoggedStore((state) => state.logout);
  const updateUser = useUserStore((state) => state.updateUser);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const { userLogged } = route.params;
  const userId = userLogado.id;
  const [isLoading, setIsLoading] = useState(false);
  const [txtName, setTxtName] = useState(userLogado.name);
  const [txtEmail, setTxtEmail] = useState(userLogado.email);
  const [avatar, setAvatar] = useState(userLogado.avatar);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isDarkMode");
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.log("Erro ao carregar tema:", error);
      }
    };

    loadTheme();
  }, []);


  const toggleTheme = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(value));
    } catch (error) {
      console.log("Erro ao salvar tema:", error);
    }
  };


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

  const editUser = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      setIsLoading(true);
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
        Alert.alert("Sucesso", "Usuário editado com sucesso!");
        navigation.navigate("Account");
      } else {
        Alert.alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      Alert.alert(error.message);
    } finally {
      setIsLoading(false); 
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
        await AsyncStorage.removeItem("userLogged");
        logout();
        Alert.alert("Sucesso", "Usuário removido com sucesso!");
        navigation.navigate("Login");
      } else {
        Alert.alert(data.error);
      }
    } catch (error) {
      console.log("Error removeUser " + error.message);
      Alert.alert(error.message);
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
        <View style={styles.switchContainer}>
          <Text
            style={[
              styles.switchLabel,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Modo Noturno
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>Editar</Text>
        <View style={styles.form}>
          <TextInput
           placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="Nome..."
            onChangeText={setTxtName}
            value={txtName}
          />
          <TextInput
           placeholderTextColor={isDarkMode ? "#888" : "#666"}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
            placeholder="Email..."
            onChangeText={setTxtEmail}
            value={txtEmail}
          />
          <TouchableOpacity
            style={styles.avatarPicker}
            onPress={handleAvatarChange}
          >
            {loadingImage && (
              <ActivityIndicator
                size="large"
                color={isDarkMode ? "#fff" : "#000"}
                style={styles.activityIndicator}
              />
            )}
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
              onLoadEnd={() => setLoadingImage(false)}
            />
            <FontAwesomeIcon style={[styles.pencil, { backgroundColor: isDarkMode ? "#000" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} icon={faPencil} size={22} />
          </TouchableOpacity>
          {/* <Text style={styles.avatarText}>Clique na imagem para alterá-la</Text> */}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            <Button
              title="Cancelar"
              onPress={() => navigation.navigate("Account")}
            />
            <Button title="Salvar" onPress={editUser} />
          </>
        )}

        <Button title="Apagar conta" onPress={() => removeUser()} />
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
  pencil: {
    position: "absolute",
    top: 100,
    right: 140,
    borderRadius: 17,
    padding: 10,
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative", 
    width: 100,
    height: 100,
    marginBottom: "10",
  },
  activityIndicator: {
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
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
  switchContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: "Poppins",
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  darkTheme: {
    backgroundColor: "#000",
  },

  title: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
});

export default EditUser;
