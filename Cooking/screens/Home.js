import {View, Text, StyleSheet} from 'react-native'
import { Poppins_900Black } from '@expo-google-fonts/poppins'
import { useFonts } from '@expo-google-fonts/poppins'
import Body from '../components/Body';

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
     <Body />
     
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titulo: {
        fontFamily: 'Poppins_900Black',
        fontSize: 25,
        marginTop: 40,
        marginLeft: 20,
        alignSelf: 'flex-start'

    }
})

export default Home