import {View, Text, StyleSheet} from 'react-native'
import { Poppins_900Black } from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins'

const Home = () => {
    let [fontsLoaded] = useFonts({
        Poppins_900Black,
      });
    
      if (!fontsLoaded) {
        return null;
      }
  return (
    <View style={styles.container}>
      
      <Text style={styles.titulo}>Suas receitas</Text>

     
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

export default Home