import {View, Text, StyleSheet, TextInput} from 'react-native'
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useUserLoggedStore from '../stores/useUserLoggedStore.js'

const Splash = () => {

  const navigation = useNavigation()
  const login = useUserLoggedStore(state => state.login)
 
  useEffect(() => {
    const checkUserLogged = async () => {
      try {
        const dataFound = await AsyncStorage.getItem('userLogged')
        console.log('dataFound:', dataFound)
        if(dataFound){
          const data = JSON.parse(dataFound)
          console.log('data:', data)
          const { token } = data
          delete data.token
          login(data, token)
          setTimeout(() => {
            navigation.navigate('Main')
          }, 2000)
        } else {
          setTimeout(() => {
            navigation.navigate('Login')
          }, 2000)
        }
      } catch (error){
        console.log('Erro ao ler dado')
      }
    } 
    checkUserLogged()
  },[])

  return (
    <View style={styles.container}>
      <Image
      source={require('../assets/loading.gif')} 

    />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff082"
    }
})

export default Splash