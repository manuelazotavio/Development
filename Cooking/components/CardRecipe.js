import { View, Text, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from "react";
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardRecipe = ({ recipe }) => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      setIsDarkMode(storedTheme === "true");
    } catch (error) {
      console.error(error);
    }
  };

  loadThemePreference()

  return (
    <Pressable onPress={() => navigation.navigate('Recipe', { recipe })}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {loadingImage && (
            <ActivityIndicator
              size="large"
              color={isDarkMode ? "#fff" : "#000"}
              style={styles.activityIndicator}
            />
          )}
          <Image 
            onLoad={() => setLoadingImage(false)}
            onError={() => setLoadingImage(false)} 
            source={{ uri: recipe.image }} 
            style={styles.img} 
          />
        </View>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>{recipe.name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faClock} size={19} color='#FF421D' />
            <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>{recipe.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faStar} color="#F7D342" size={23} />
            <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>{recipe.rating}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faUser} color='#9EA69E' size={19} />
            <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>{recipe.portions}</Text>
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
  img: {
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
  title: {
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

export default CardRecipe;
