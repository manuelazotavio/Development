import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from "react";

import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useFonts } from "@expo-google-fonts/poppins";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Receita = () => {
  const [modalVisible, setModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const route = useRoute();
  const navigation = useNavigation();
  const { receita } = route.params;

  //removerReceita
  const removeReceita = async () => {
    try {
      const result = await fetch(
        "https://backcooking.onrender.com/receita/" + receita.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error removeReceita " + error.message);
      alert(error.message);
    }
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId)
      return userId;
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  };

  const favReceita = async (userId) => {
    try {
      const result = await fetch(
        "https://backcooking.onrender.com/favorito/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(userId), // substitua por seu userId
            receitaId: receita.id, // assumindo que receita.id é o id da receita
          }),
        }
      );
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error favReceita " + error.message);
      alert(error.message);
    }
  };

  const onFavReceita = async () => {
    const userId = await getUserId();
    favReceita(userId, receita.id);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image
          source={{ uri: "https://fakeimg.pl/600x400" }}
          style={styles.fotoImg}
        />

        <View style={styles.iconContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={faTrashCan} size={19} />
          </Pressable>
          <Pressable onPress={onFavReceita}>
            <FontAwesomeIcon icon={faHeart} size={19} color="#d31717" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Editar", { receita })}>
            <FontAwesomeIcon icon={faPencil} size={19} />
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.titulo}>{receita.name}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesomeIcon icon={faClock} size={19} color="#FF421D" />
              <Text>{receita.tempo}</Text>
            </View>
            <View style={styles.infoItem}>
              <FontAwesomeIcon icon={faStar} color="#F7D342" size={22} />
              <Text>{receita.avaliacao}</Text>
            </View>
            <View style={styles.infoItem}>
              <FontAwesomeIcon icon={faUser} color="#9EA69E" size={19} />
              <Text>{receita.porcoes}</Text>
            </View>
          </View>
          <View style={styles.descricao}>
            <Text style={styles.texto}>{receita.descricao}</Text>
          </View>
          <Text style={styles.subtitulo}>ingredientes</Text>
          <View style={styles.ingredientes}>
            {receita.ingredientes.split(";").map((ingrediente, index) => (
              <Text key={index}>{ingrediente} </Text>
            ))}
          </View>
          <Text style={styles.subtitulo}>passo a passo</Text>
          <View style={styles.ingredientes}>
            {receita.instrucao.split(";").map((step, index) => (
              <Text style={styles.textoIng} key={index}>
                <Text style={{ fontWeight: "bold" }}>{`${index + 1}. `}</Text>
                {step}
              </Text>
            ))}
          </View>
          {/* <AdicionarBtn title={"Remover"} onPress={removeReceita}/> */}
          <View style={{ height: 20 }} />
        </View>
        <View style={styles.centeredView}>
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
                <Text style={styles.modalText}>Tem certeza?</Text>
                <Pressable
                  style={[styles.button, styles.buttonRemove]}
                  onPress={removeReceita}
                >
                  <Text style={styles.textStyle}>Sim, remover receita</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  card: {
    flex: 1,
    flexDirection: "column",

    borderRadius: 20,
    marginHorizontal: 10,
    marginLeft: 10,
    width: 300,
  },
  fotoImg: {
    width: 500,
    height: 400,
    borderRadius: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    gap: 30,
    paddingVertical: 10,
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 26,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  button: {
    marginVertical: 10,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    elevation: 2,
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
  infoItem: {
    flexDirection: "column", // Altere para 'column'
    alignItems: "center",
    justifyContent: "center", // Adicione esta linha
    marginRight: 10,
  },
  descricao: {
    paddingVertical: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 40,
    width: 100,
  },
  texto: {
    fontSize: 18,
    color: "#9EA69E",
  },
  textoIng: {
    fontSize: 18,
    color: "#000",
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: "Poppins_900Black",
    alignSelf: "flex-start",
    paddingVertical: 10,
  },
  ingredientes: {},
});

export default Receita;
