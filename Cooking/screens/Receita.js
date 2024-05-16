import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { Pressable } from "react-native";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native";
import { useFonts } from "@expo-google-fonts/poppins";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AdicionarBtn from "../components/AdicionarBtn";

const Receita = () => {
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
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image
          source={{ uri: "https://fakeimg.pl/600x400" }}
          style={styles.fotoImg}
        />
        <View style={styles.iconContainer}>
          <Pressable onPress={removeReceita}>
            <FontAwesomeIcon icon={faTrashCan} size={19} />
          </Pressable>
          <FontAwesomeIcon icon={faHeart} size={19} color="#d31717" />
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
