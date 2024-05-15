import {View, Text, StyleSheet} from 'react-native'
import { Poppins_900Black } from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react'

const Conta = () => {
  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const [nameUser, setNameUser] = useState('')
  

  const getAS = async (data) => {
    let dataFound = null
    try {
      dataFound = await AsyncStorage.getItem(data)
    } catch (error){
      console.log('Erro ao ler dado')
    }
    return dataFound
  }

  useEffect(() => {
    const getNome = async () =>{
      const nome = await getAS('nome')
      setNameUser(nome)
    }

    getNome()
  },[])
  return (
    <View style={styles.container}>
      
      <Text style={styles.titulo}>Sua conta</Text>
      <Text>Nome salvo: {nameUser}</Text>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
      height: 40,
      width: '100%',
      backgroundColor: '#FFF',
      borderWidth: 1,
      marginBottom: 18,
      padding: 10,
  },
  titulo: {
    fontFamily: 'Poppins_900Black',
    fontSize: 25
}
})

export default Conta