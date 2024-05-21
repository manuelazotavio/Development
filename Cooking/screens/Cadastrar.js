import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CadastrarBtn from "../components/CadastrarBtn";

const Cadastrar = () => {
  const navigation = useNavigation();

  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtAvatar, setTxtAvatar] = useState("");
  const [txtPass, setTxtPass] = useState("");

  const postUser = async () => {
    try {
      //const result = await fetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user', {
      const result = await fetch("https://backcooking.onrender.com/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: txtName,
          email: txtEmail,
          pass: txtPass,
          avatar: txtAvatar,
        }),
      });
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        navigation.goBack();
      } else {
        if (result.status === 400) {
          setModalMessage("Os campos são inválidos ou vazios.");
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log("Error postUser " + error.message);
      alert(error.message);
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", width: "100%", flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Cadastrar</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Senha..."
            onChangeText={setTxtPass}
            value={txtPass}
          />
          <TextInput
            style={styles.input}
            placeholder="Avatar..."
            onChangeText={setTxtAvatar}
            value={txtAvatar}
          />
          <CadastrarBtn title="Cadastrar" onPress={postUser} />
          <CadastrarBtn
            title="Voltar"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 200
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#ededed",
    marginBottom: 10,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  form: {
    display: "flex",
    width: "80%",
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
    fontSize: 20,
    marginTop: 40,
    marginLeft: 5,
    marginBottom: 10,
  },
});

export default Cadastrar;
