import { View, Text, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CardReceita = ({ receita }) => {
  return (
    <View style={styles.card}>
     <Image source={{uri: "https://fakeimg.pl/600x400"}} style={styles.fotoImg} />
      <Text style={styles.titulo}>{receita.name}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Feather name="clock" size={20} color="#000" />
          <Text>{receita.tempo}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="star" size={20} color="#000" />
          <Text>{receita.avaliacao}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="user" size={20} color="#000" />
          <Text>{receita.porcoes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 20,
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
    alignItems: 'center',
    marginRight: 10
  },
});

export default CardReceita;