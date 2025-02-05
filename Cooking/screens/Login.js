import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Switch,
  StatusBar,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFonts } from "@expo-google-fonts/poppins";
import Button from "../components/Button.js";
import { useNavigation } from "@react-navigation/native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserLoggedStore from "../stores/useUserLoggedStore.js";
import CadastrarBtn from "../components/CadastrarBtn.js";
import logo from "../assets/logo.png";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  const login = useUserLoggedStore((state) => state.login);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem(
          "userLogged",
          JSON.stringify({ ...data.user, token: data.token })
        );
        login(data.user, data.token);
        navigation.navigate("Main");
      } else {
        Alert.alert("Erro", "Usuário não encontrado");
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


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[
          styles.container,
          isDarkMode ? styles.darkTheme : styles.lightTheme,
        ]}
      >
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
        <Image style={styles.logo} source={logo} />
        <Text style={[styles.titulo, { color: isDarkMode ? "#fff" : "#000" }]}>
          Login
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? "#333" : "#ededed",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholder="E-mail"
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
          onChangeText={setTxtEmail}
          value={txtEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#333" : "#ededed",
                color: isDarkMode ? "#fff" : "#000",
                paddingRight: 40,
              },
            ]}
            placeholder="Senha"
            placeholderTextColor={isDarkMode ? "#888" : "#666"}
            onChangeText={setTxtPass}
            secureTextEntry={!showPassword}
          />
          <Pressable style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              size={20}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </Pressable>
        </View>
        {isLoading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={isDarkMode ? "#fff" : "#000"}
          />
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
          <Text
            style={[styles.texto, { color: isDarkMode ? "#aaa" : "#9EA69E" }]}
          >
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
    padding: 10,
    borderRadius: 10,
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 30,
    fontFamily: "Poppins",
    fontWeight: "900",
    marginBottom: 20,
  },
  switchContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel:{
    fontFamily: "Poppins",
    fontWeight: 600,
    marginRight: 10,
  },
  lightTheme: {
    backgroundColor: "#fff",
  },
  loading: {
    margin: 10
  },
  darkTheme: {
    backgroundColor: "#000",
  },
});

export default Login;
