import { useState } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text } from "react-native";
import { Button } from "react-native";

// import { useNavigation } from '@react-navigation/native'

const Criar = () => {
  // const navigation = useNavigation()

  const [txtName, setTxtName] = useState("");
  const [txtDescricao, setTxtDescricao] = useState("");
  const [txtPorcao, setTxtPorcao] = useState("");
  const [txtTempo, setTxtTempo] = useState("");

  const postReceita = async () => {
    try {
      const result = await fetch("https://backcooking.onrender.com/receita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: txtName,
          descricao: txtDescricao,
          porcao: txtPorcao,
          tempo: txtTempo,
        }),
      });
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        console.log("sucesso");
      } else {
        console.log("erro");
      }
    } catch (error) {
      console.log("Error postReceita " + error.message);
      alert(error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.titulo}>Crie sua receita!</Text>
        <TextInput
          style={styles.input}
          placeholder="Título da Receita"
          onChangeText={setTxtName}
          value={txtName}
        />
        <TextInput
          style={styles.inputDesc}
          placeholder="Compartilhe um pouco mais 
sobre o seu prato. 
O que você gosta nele?"
          onChangeText={setTxtDescricao}
          value={txtDescricao}
        />

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
        <Text style={styles.subtitulo}>Ingredientes</Text>
        <TextInput
          style={styles.input}
          placeholder="250g de açúcar"
          onChangeText={setTxtTempo}
          value={txtTempo}
        />
        <Button title="Publicar" onPress={postReceita} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    display: "flex",
    padding: 40,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#FFF",
    marginBottom: 18,
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
  },
  inputDesc: {
    height: 90,
    width: "auto",
    backgroundColor: "#FFF",
    marginBottom: 18,
    padding: 10,
    borderRadius: 10,
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 25,
  },
  subtitulo: {
    fontSize: 20
  }
});

export default Criar;
