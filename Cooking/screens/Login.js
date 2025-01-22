import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Switch,
  StatusBar
} from "react-native";
import Button from "../components/Button.js";
import { useNavigation } from "@react-navigation/native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import logo from "../assets/logo.png";
import { useFonts } from "@expo-google-fonts/poppins";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserLoggedStore from "../stores/useUserLoggedStore.js";
import CadastrarBtn from "../components/CadastrarBtn.js";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Controle do modo noturno
  const navigation = useNavigation();
  const login = useUserLoggedStore((state) => state.login);

  // Carregar o tema salvo ao iniciar o app
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

  // Alternância do tema e salvamento
  const toggleTheme = async (value) => {
    try {
      setIsDarkMode(value);
  
      if (value) {
        // Salvar tema no AsyncStorage
        await AsyncStorage.setItem("isDarkMode", JSON.stringify(value));
      } else {
        // Remover tema do AsyncStorage
        await AsyncStorage.removeItem("isDarkMode");
      }
    } catch (error) {
      console.log("Erro ao salvar/remover tema:", error);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://backcooking.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: txtEmail, pass: txtPass }),
        }
      );

      if (response?.ok) {
        const data = await response.json();
        try {
          await AsyncStorage.setItem(
            "userLogged",
            JSON.stringify({ ...data.user, token: data.token })
          );

          await AsyncStorage.setItem("username", data.user.name);
          await AsyncStorage.setItem("userId", String(data.user.id));
          login(data.user, data.token);

          navigation.navigate("Main");
        } catch (error) {
          console.log(error);
          Alert.alert("Erro ao gravar dados de login no dispositivo!");
          navigation.navigate("Login");
        }
      } else {
        const data = await response.json();
        if (response.status === 401) {
          setModalMessage("Usuário não encontrado.");
          setModalVisible(true);
        }
        if (response.status === 400) {
          let errorMessage = "";
          for (let field in data.fields) {
            errorMessage += data.fields[field].messages[0] + " ";
          }
          setModalMessage(errorMessage.trim());
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const themeStyles = isDarkMode ? styles.darkTheme : styles.lightTheme; // Estilos dinâmicos

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, themeStyles]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />
        {/* Alternância do tema */}
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: isDarkMode ? "#fff" : "#000" }]}>
            Modo Noturno
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <Image style={styles.logo} source={logo}></Image>
        <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>
          Login
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? "#333" : "#ededed", color: isDarkMode ? "#fff" : "#000" },
          ]}
          placeholder="E-mail"
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
          onChangeText={setTxtEmail}
          value={txtEmail}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDarkMode ? "#333" : "#ededed", color: isDarkMode ? "#fff" : "#000" },
          ]}
          placeholder="Senha"
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
          onChangeText={setTxtPass}
          value={txtPass}
          secureTextEntry={true}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
        ) : (
          <>
            <Button title="Entrar" onPress={handleLogin} />
            <CadastrarBtn
              title="Esqueceu a senha?"
              onPress={() => navigation.navigate("EsqueciSenha")}
            />
          </>
        )}

        <View style={styles.descricao}>
          <Text style={[styles.texto, { color: isDarkMode ? "#aaa" : "#9EA69E" }]}>
            Não possui um cadastro?
          </Text>
        </View>
        <CadastrarBtn
          title="Cadastre-se"
          onPress={() => navigation.navigate("Cadastrar")}
        />
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
  },
  input: {
    height: 40,
    width: "80%",
    marginBottom: 10,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
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
    marginTop: 40,
    marginLeft: 5,
  },
  descricao: {
    paddingVertical: 10,
  },
  texto: {
    fontSize: 18,
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
});

export default Login;
