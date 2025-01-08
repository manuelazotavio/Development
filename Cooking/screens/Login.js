import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Button from "../components/Button.js";
import { useNavigation } from "@react-navigation/native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserLoggedStore from "../stores/useUserLoggedStore.js";
import CadastrarBtn from "../components/CadastrarBtn.js";

const Login = () => {
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const navigation = useNavigation();
  const login = useUserLoggedStore((state) => state.login);

  const handleLogin = async () => {
    try {
      //const response = await fetch('https://backend-api-express-1sem2024-rbd1.onrender.com/auth/login', {
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

          navigation.navigate("Splash");
        } catch (error) {
          console.log(error);
          alert("Erro ao gravar dados de login no dispositivo!");
          navigation.navigate("Login")
        }
      } else {
        const data = await response.json();
        console.log(data);
        if (response.status === 401) {
          setModalMessage("Usuário não encontrado.");
          setModalVisible(true);
        }
        if (response.status === 400) {
          let errorMessage = '';
          for (let field in data.fields) {
            errorMessage += data.fields[field].messages[0] + ' ';
          }
          setModalMessage(errorMessage.trim());
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log(error);
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
    <View style={{ backgroundColor: "#fff", width: "100%", flex:1 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email..."
          onChangeText={setTxtEmail}
          value={txtEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha..."
          onChangeText={setTxtPass}
          value={txtPass}
          secureTextEntry={true}
        />

        <Button title="Entrar" onPress={handleLogin} />
        <View style={styles.descricao}>
          <Text style={styles.texto}>Não possui um cadastro?</Text>
        </View>
        <CadastrarBtn
          title="Cadastre-se"
          onPress={() => navigation.navigate("Cadastrar")}
        />
      </View>
      {modalVisible && (
  <View style={[styles.centeredView]}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </View>
)}
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
    marginTop: 22,
  },
  tHButton: {
    borderRadius: 20,
    marginVertical: 8,
    width: 120,
    alignSelf: "center",
  },
  textButton: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Poppins_900Black",
  },

  buttonClose: {
    backgroundColor: "#FF421D",
    paddingHorizontal: 30,
  },
  buttonRemove: {
    paddingHorizontal: 20,
    backgroundColor: "#f2c40e",
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
    marginTop: 40,
    marginLeft: 5,
  },
  descricao: {
    paddingVertical: 10,
  },
  texto: {
    fontSize: 18,
    color: "#9EA69E",
  },
});

export default Login;
