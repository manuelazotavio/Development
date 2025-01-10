import { View, Text, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from "react";
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';

const CardReceita = ({ receita }) => {
  const navigation = useNavigation();
  const [loadingImage, setLoadingImage] = useState(true);
  
  return (
    <Pressable onPress={() => navigation.navigate('Receita', { receita })}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {loadingImage && (
            <ActivityIndicator
              size="large"
              color="#FF421D"
              style={styles.activityIndicator}
            />
          )}
          <Image 
            onLoad={() => setLoadingImage(false)}
            onError={() => setLoadingImage(false)} 
            source={{ uri: receita.imagem }} 
            style={styles.fotoImg} 
          />
        </View>
        <Text style={styles.titulo}>{receita.name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faClock} size={19} color='#FF421D' />
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
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative', // Permite o uso de position: absolute nos elementos filhos
  },
  fotoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }], // Centraliza o indicador
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
    alignSelf: 'flex-start',
  },
  infoItem: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
});

export default CardReceita;
