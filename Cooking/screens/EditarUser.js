import { View, StyleSheet, ScrollView, TextInput, Text } from "react-native";
import Button from "../components/Button.js";
import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "../stores/userStore.js";
import authFetch from "../helpers/authFetch.js";


const EditarUser = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const removeUserStore = useUserStore((state) => state.removeUser);
  const updateUser = useUserStore((state) => state.updateUser);

  
  const { userLogado } = route.params;
  const userId = userLogado.id

  const [txtName, setTxtName] = useState(userLogado.name);
  const [txtEmail, setTxtEmail] = useState(userLogado.email);
  const [txtAvatar, setTxtAvatar] = useState(userLogado.avatar);

  const editUser = async () => {
    try {
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      const result = await authFetch(
        "https://backcooking.onrender.com/user/" + userId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: txtName,
            email: txtEmail,
            avatar: txtAvatar,
          }),
        }
      );
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
        //update do user na store com o data.user
        await AsyncStorage.setItem('userLogged', JSON.stringify(data.user));
        updateUser(data.user);
        navigation.goBack();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.log("Error edit " + error.message);
      alert(error.message);
    }
  };

  const removeUser = async () =>{
    try{
      //const result = await authFetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user/'+user.id, {
      const result = await authFetch('https://backcooking.onrender.com/user/'+ userId, {
        method: "DELETE",
        headers:{
          "Content-Type": "application/json"
        }
      })
      if(!result.ok){
        const dataError = await result.json()
        if(dataError?.error && dataError?.code && dataError.code === "logout"){
          alert('Sessão expirada!')
          navigation.navigate('Login')
          return
        }
      }
      const data = await result.json()
      console.log(data)
      if(data?.success){
        removeUserStore(userId)
        navigation.navigate('Splash')
      } else {
        alert(data.error)
      }
    } catch (error){
      console.log('Error removeUser ' + error.message)
      alert(error.message)
    }
  } 

  return (
    <View style={{ backgroundColor: "#fff", width: "100%", flex: 1 }}>
      <View>
        <View style={styles.container}>
          <Text style={styles.titulo}>Editar</Text>
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
              placeholder="Avatar..."
              onChangeText={setTxtAvatar}
              value={txtAvatar}
            />
          </View>
        </View>
      </View>
      <Button title="Cancelar" onPress={() => navigation.navigate("Conta")} />
      <Button title="Salvar" onPress={editUser} />

      <Button title="Apagar conta" onPress={removeUser} />
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

  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 20,
    marginTop: 40,
    marginLeft: 5,
    marginBottom: 10,
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
});

export default EditarUser;
