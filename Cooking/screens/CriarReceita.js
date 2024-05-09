import React, { useState } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text } from "react-native";
import Button from "../components/Button";
import AdicionarBtn from "../components/AdicionarBtn";

const CriarReceita = () => {
  const [txtName, setTxtName] = useState("");
  const [txtDescricao, setTxtDescricao] = useState("");
  const [txtPorcao, setTxtPorcao] = useState("");
  const [txtTempo, setTxtTempo] = useState("");
  const [txtAvaliacao, setTxtAvaliacao] = useState("");
  const [ingredientes, setIngredientes] = useState([""]);
  const [passos, setPassos] = useState([""]);

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
          porcoes: txtPorcao,
          tempo: txtTempo,
          avaliacao: txtAvaliacao,
          ingredientes: ingredientes.filter(ingrediente => ingrediente !== "").join("\n"),
          instrucao: passos.filter(passo => passo !== "").join("\n"),
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
    <View >

   
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
          value={txtAvaliacao}
        />
        
        <Button title="Publicar" onPress={postReceita} />
      </View>
    </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    display: "flex",
    paddingHorizontal: 25,
    paddingVertical: 15
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#FFF",
    marginBottom: 18,
    marginTop: 5,
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
  inputPasso: {
    height: 60,
    width: "auto",
    backgroundColor: "#FFF",
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  passoNumero: {
    width: 30,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CriarReceita;
