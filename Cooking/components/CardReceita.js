import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useNavigation } from '@react-navigation/native';

const CardReceita = ({ receita }) => {
  const navigation = useNavigation()
  
  return (
    <Pressable onPress={() => navigation.navigate('Receita', {receita})}>
    <View style={styles.card}>
     <Image source={{uri: receita.imagem}} style={styles.fotoImg} />
      <Text style={styles.titulo}>{receita.name}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
        <FontAwesomeIcon icon={faClock} size={19} color='#FF421D'/>
          <Text>{receita.tempo}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesomeIcon icon={faStar} color="#F7D342" size={23} />
          <Text>{receita.avaliacao}</Text>
        </View>
        <View style={styles.infoItem}>
        <FontAwesomeIcon icon={faUser} color='#9EA69E' size={19} />
          <Text>{receita.porcoes}</Text>
        </View>
      </View>
    </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    marginLeft: 20,
    width: 300,
  },
  fotoImg: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 30,
    paddingVertical: 10,
  },
  titulo: {
    fontFamily: 'Poppins_900Black',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 0,
    alignSelf: 'flex-start'

},
infoItem: {

    height: 40, // adjust this value as needed
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10
},
});

export default CardReceita;