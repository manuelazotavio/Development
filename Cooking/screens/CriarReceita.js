import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import authFetch from "../helpers/authFetch";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker"; // Usando Expo Image Picker
import AdicionarBtn from "../components/AdicionarBtn";
import { useNavigation } from "@react-navigation/native";
import useUserLoggedStore from "../stores/useUserLoggedStore";

const CriarReceita = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtDescricao, setTxtDescricao] = useState("");
  const [txtPorcao, setTxtPorcao] = useState("");
  const [txtTempo, setTxtTempo] = useState("");
  const [txtAvaliacao, setTxtAvaliacao] = useState("");
  const [ingredientes, setIngredientes] = useState([""]);
  const [passos, setPassos] = useState([""]);
  const [imagem, setImagem] = useState(null);

  const navigation = useNavigation();
  const userId = useUserLoggedStore((state) => state.id);

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

  const postReceita = async () => {
    try {
      console.log(userId);
      setIsLoading(true)

      // Criação do FormData
      const formData = new FormData();

      // Adiciona os campos ao FormData
      formData.append("userId", userId);
      formData.append("name", txtName);
      formData.append("descricao", txtDescricao);
      formData.append("porcoes", txtPorcao);
      formData.append("tempo", txtTempo);
      formData.append("avaliacao", Number(txtAvaliacao));
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
        "https://backcooking.onrender.com/receita",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await result.json();
      console.log(data);

      if (data?.success) { 
        navigation.navigate("Home");
        Alert.alert("Sucesso", "Receita criada com sucesso!");
       
      } else {
        
        if (data.fields) {
          Object.keys(data.fields).forEach((field) => {
            const mensagens = data.fields[field].messages;
        
            mensagens.forEach((mensagem) => { 
              
              Alert.alert("Erro!", `${mensagem}`);
              console.log(`${field}: ${mensagem}`); // Exibe o campo e a mensagem
            });
          });
        } else {
          Alert.alert("Erro!", `Não foi possível salvar a receita.`);
        }
       
        
      }
    } catch (error) {
      console.log("Error postReceita " + error.message);
    } finally {
      setIsLoading(false); // Parar o carregamento
    }
  };

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Crie sua receita!</Text>
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
                placeholder="Misture a massa até se tornar homogênea."
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
            value={txtAvaliacao}
          />

          <TouchableOpacity
            style={styles.imagemPicker}
            onPress={handleImagemChange}
          >
            {imagem ? (
              <Image source={{ uri: imagem }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>
                Escolha uma imagem para a sua receita!
              </Text>
            )}
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <Button title="Publicar" onPress={postReceita} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "30",
    backgroundColor: "white",
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
  imagemPicker: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
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
    marginLeft: 30,
    alignSelf: "flex-start",
  },
  subtitulo: {
    fontSize: 20,
  },
  passoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passoNumero: {
    width: 30,
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CriarReceita;
