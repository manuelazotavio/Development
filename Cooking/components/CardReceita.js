import { View, Text, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CardReceita = ({ receita }) => {
  return (
    <View style={styles.card}>
      <Image source={"https://fakeimg.pl/600x400"} style={styles.fotoImg} />
      <Text style={styles.titulo}>{receita.name}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Feather name="clock" size={15} color="#000" />
          <Text>{receita.tempo}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="star" size={15} color="#000" />
          <Text>{receita.avaliacao}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="user" size={15} color="#000" />
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10
  },
  fotoImg: {
    width: '100%'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  titulo: {
    fontFamily: 'Poppins_900Black',
    fontSize: 15,
    marginTop: 40,
    marginLeft: 20,
    alignSelf: 'flex-start'

},
  infoItem: {
    alignItems: 'center',
    marginRight: 10
  },
});

export default CardReceita;