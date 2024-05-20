import { Text, View, StyleSheet, ScrollView, TextInput } from "react-native";
import Button from "../components/Button.js";
import { useState } from "react";
import AdicionarBtn from "../components/AdicionarBtn.js";
import { useRoute, useNavigation } from "@react-navigation/native";

const EditarReceita = () => {
  const route = useRoute();
  const navigation = useNavigation();


  const {receita} = route.params;

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



  const [txtName, setTxtName] = useState(receita.name);
  const [txtDescricao, setTxtDescricao] = useState(receita.descricao);
  const [txtPorcao, setTxtPorcao] = useState(receita.porcoes);
  const [txtTempo, setTxtTempo] = useState(receita.tempo);
  const [txtAvaliacao, setTxtAvaliacao] = useState(receita.avaliacao);
  const [ingredientes, setIngredientes] = useState(
    receita.ingredientes.split(";")
  );
  const [passos, setPassos] = useState(receita.instrucao.split(";"));

  const editReceita = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      const result = await fetch(
        "https://backcooking.onrender.com/receita/" + receita.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: txtName,
            descricao: txtDescricao,
            porcoes: txtPorcao,
            tempo: txtTempo,
            avaliacao: txtAvaliacao,
            ingredientes: ingredientes
              .filter((ingrediente) => ingrediente !== "")
              .join(";"),
            instrucao: passos.filter((passo) => passo !== "").join(";"),
          }),
        }
      );
      console.log(result);
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      alert(error.message);
    }
  };

  const removeUser = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      const result = await authFetch("http://localhost:3333/user/" + user.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!result.ok) {
        const dataError = await result.json();
        if (
          dataError?.error &&
          dataError?.code &&
          dataError.code === "logout"
        ) {
          alert("Sessão expirada!");
          navigation.navigate("Login");
          return;
        }
      }
      const data = await result.json();
      console.log(data);
      if (data?.success) {
        removeUserStore(user.id);
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error removeUser " + error.message);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container} >

   
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
          value={txtAvaliacao}
        />
        
        
        <Button title="Cancelar"  onPress={() => navigation.goBack()} />
        <Button title="Salvar" onPress={editReceita} />
      </View>
    </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  form: {
    display: "flex",
    paddingHorizontal: 25,
    paddingVertical: 15
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

export default EditarReceita;
