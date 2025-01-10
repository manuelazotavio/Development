import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button.js";
import { useState } from "react";
import AdicionarBtn from "../components/AdicionarBtn.js";
import * as ImagePicker from "expo-image-picker"; // Usando Expo Image Picker
import { useRoute, useNavigation } from "@react-navigation/native";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useUserLoggedStore from "../stores/useUserLoggedStore";
import authFetch from "../helpers/authFetch.js";

const EditarReceita = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userId = useUserLoggedStore((state) => state.id);
    const [isLoading, setIsLoading] = useState(false);

  const { receita } = route.params;

  const addIngrediente = () => {
    setIngredientes([...ingredientes, ""]);
  };

  const addPasso = () => {
    setPassos([...passos, ""]);
  };

  const handleIngredienteChange = (text, index) => {
    const newIngredientes = [...ingredientes];
    newIngredientes[index] = text;
    setIngredientes(newIngredientes);
  };

  const handlePassoChange = (text, index) => {
    const newPassos = [...passos];
    newPassos[index] = text;
    setPassos(newPassos);
  };
  const [loadingImage, setLoadingImage] = useState(true);
  const [txtName, setTxtName] = useState(receita.name);
  const [txtDescricao, setTxtDescricao] = useState(receita.descricao);
  const [imagem, setImagem] = useState(receita.imagem);
  const [txtPorcao, setTxtPorcao] = useState(receita.porcoes);
  const [txtTempo, setTxtTempo] = useState(receita.tempo);
  const [txtAvaliacao, setTxtAvaliacao] = useState(receita.avaliacao);
  const [ingredientes, setIngredientes] = useState(
    receita.ingredientes.split(";")
  );
  const [passos, setPassos] = useState(receita.instrucao.split(";"));

  const handleImagemChange = async () => {
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
      setImagem(result.assets[0].uri);
    }
  };

  const editReceita = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {

      const formData = new FormData();

      setIsLoading(true)

      // Adiciona os campos ao FormData

      formData.append("name", txtName);
      formData.append("descricao", txtDescricao);
      formData.append("porcoes", txtPorcao);
      formData.append("tempo", txtTempo);
      formData.append("avaliacao", parseInt(txtAvaliacao));
      formData.append(
        "ingredientes",
        ingredientes.filter((ingrediente) => ingrediente !== "").join(";")
      );
      formData.append(
        "instrucao",
        passos.filter((passo) => passo !== "").join(";")
      );

      formData.append("imagem", {
        uri: imagem,
        name: `imagem_${Date.now()}_${userId}.jpg`,
        type: "image/jpeg",
      });
      const result = await authFetch(
        "https://backcooking.onrender.com/receita/" + receita.id,
        {
          method: "PUT",
          body: formData,
        }
      );
      console.log(result);
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        Alert.alert("Sucesso", "Receita editada com sucesso!");
        navigation.navigate("Main");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      alert(error.message);
    } finally {
      setIsLoading(false); // Parar o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Edite sua receita!</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Título da Receita"
            onChangeText={setTxtName}
            value={txtName}
          />
          <TextInput
            style={styles.inputDesc}
            placeholder="Compartilhe um pouco mais sobre o seu prato. O que você gosta nele?"
            onChangeText={setTxtDescricao}
            value={txtDescricao}
            multiline
          />

          <Text style={styles.subtitulo}>Ingredientes</Text>
          {ingredientes.map((ingrediente, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="250g de açúcar"
              onChangeText={(text) => handleIngredienteChange(text, index)}
              value={ingrediente}
            />
          ))}
          <AdicionarBtn title="Ingrediente" onPress={addIngrediente} />

          <Text style={styles.subtitulo}>Passo a passo</Text>
          {passos.map((passo, index) => (
            <View key={index} style={styles.passoContainer}>
              <Text style={styles.passoNumero}>{index + 1}.</Text>
              <TextInput
                style={styles.inputPasso}
                placeholder="Misture a massa até se 
tornar homogênea."
                onChangeText={(text) => handlePassoChange(text, index)}
                value={passo}
              />
            </View>
          ))}
          <AdicionarBtn title="Passo" onPress={addPasso} />

          <Text>Porções</Text>
          <TextInput
            style={styles.input}
            placeholder="2 pessoas"
            onChangeText={setTxtPorcao}
            value={txtPorcao}
          />
          <Text>Tempo de preparo</Text>
          <TextInput
            style={styles.input}
            placeholder="1h e 30min"
            onChangeText={setTxtTempo}
            value={txtTempo}
          />

          <Text>Avaliação</Text>
          <TextInput
            style={styles.input}
            placeholder="4.5"
            onChangeText={setTxtAvaliacao}
            value={String(txtAvaliacao)}
          />
          <TouchableOpacity
            style={styles.avatarPicker}
            onPress={handleImagemChange}
          >
            {loadingImage && (
              <ActivityIndicator
                size="small"
                color="#FF421D"
                style={styles.fotoImgLoading}
              />
            )}
            <Image
              onLoad={() => setLoadingImage(false)}
              onError={() => setLoadingImage(false)}
              source={{ uri: imagem }}
              style={styles.avatar}
            />
            <FontAwesomeIcon style={styles.pencil} icon={faPencil} size={22} />
          </TouchableOpacity>
             {isLoading ? (
                        <ActivityIndicator size="large" color="black" />
                      ) : (
                        <>
          <Button title="Cancelar" onPress={() => navigation.goBack()} />
          <Button title="Salvar" onPress={editReceita} /></>
                      )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "40",
    paddingBottom: "30",
  },
  imagemPicker: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#ededed",
    marginBottom: 18,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
  },
  inputDesc: {
    height: 90,
    width: "auto",
    backgroundColor: "#ededed",
    marginBottom: 18,
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  avatarText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  fotoImgLoading: {
    position: "absolute",
    top: 70,
    right: 143,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
  },
  pencil: {
    position: "absolute",
    top: 100,
    right: 120,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
  },
  inputPasso: {
    height: 60,
    width: "auto",
    backgroundColor: "#ededed",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    flex: 1,
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  subtitulo: {
    fontSize: 20,
  },
  passoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPicker: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 20,
  },
  passoNumero: {
    width: 30,
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditarReceita;
