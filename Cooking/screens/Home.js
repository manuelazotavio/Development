import { View, Text, StyleSheet } from "react-native";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { useFonts } from "@expo-google-fonts/poppins";
import { ImageBackground } from "react-native";
import Body from "../components/Body";
const image = {
  uri: "https://i.pinimg.com/564x/f8/31/20/f831208ac2e24b2cb706cd2d2e960fe6.jpg",
};

const Home = () => {
  let [fontsLoaded] = useFonts({
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background.png')}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <Text style={styles.titulo}>Suas receitas</Text>
      <Body />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: "Poppins_900Black",
    fontSize: 25,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
});

export default Home;
