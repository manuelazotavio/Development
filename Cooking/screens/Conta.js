import {View, Text, StyleSheet} from 'react-native'
import { Poppins_900Black } from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native';

const Conta = () => {
  const [nameUser, setNameUser] = useState('')
  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

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
      const nome = await getAS('username')
      setNameUser(nome)
    }

    getNome()
  },[])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
       <ImageBackground 
        resizeMode="cover"
        source={require('../assets/foodBackground.png')}
        style={styles.bg}
      >
        <Text style={styles.titulo}>Sua conta</Text>
        <Text>Nome salvo: {nameUser}</Text>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    bg: { 
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        padding: 40
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
    fontSize: 25,
    textAlign: 'left'
}
})

export default Conta