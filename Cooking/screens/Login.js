import {View, Text, StyleSheet, TextInput} from 'react-native'
//import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button.js'
import { useNavigation } from '@react-navigation/native'

import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useUserLoggedStore from '../stores/useUserLoggedStore.js'
import CadastrarBtn from '../components/CadastrarBtn.js'

const Login = () => {

  const [txtEmail, setTxtEmail] = useState('')
  const [txtPass, setTxtPass] = useState('')
  const navigation = useNavigation()
  const login = useUserLoggedStore(state => state.login)


  const handleLogin = async () => {
    try{
      //const response = await fetch('https://backend-api-express-1sem2024-rbd1.onrender.com/auth/login', {
      const response = await fetch('https://backcooking.onrender.com/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: txtEmail, pass: txtPass })
      })

      if(response?.ok){
        const data = await response.json()
        try {
          await AsyncStorage.setItem('userLogged', JSON.stringify({...data.user, token: data.token}))
          login(data.user, data.token)
          navigation.navigate('Home')
        } catch (error){
          console.log(error)
          alert('Erro ao gravar dados de login no dispositivo!')
        }
      } else {
        const data = await response.json()
        console.log(data)
        alert(data?.error ? data.error : "Erro ao logar!")
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <View style={{backgroundColor: "#fff", width: "100%", flex: 1}}>
    <View style={styles.container}>
    <Text style={styles.titulo}>Entrar</Text>

      <TextInput 
        style={styles.input}
        placeholder='Email...'
        onChangeText={setTxtEmail}
        value={txtEmail}
        />
      <TextInput 
        style={styles.input}
        placeholder='Senha...'
        onChangeText={setTxtPass}
        value={txtPass}
        secureTextEntry={true}
      />

      <Button 
        title="Entrar"
        onPress={handleLogin}
      />
       <View style={styles.descricao}>
            <Text style={styles.texto}>Não possui um cadastro?</Text>
          </View>
      <CadastrarBtn
        title="Cadastre-se"
        onPress={() => navigation.navigate('Cadastrar')}
      />
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
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
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 30,
    marginTop: 40,
    marginLeft: 5,
    alignSelf: "flex-start",
    justifyContent: 'flex-start'
  },
  descricao: {
    paddingVertical: 10,
  },
  texto: {
    fontSize: 18,
    color: "#9EA69E",
  },
})

export default Login