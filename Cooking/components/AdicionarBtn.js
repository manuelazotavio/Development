import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

const AdicionarBtn = ({ title, onPress }) => {
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.customButton}>
        <Feather name="plus" size={24} color="white" style={styles.icon} />
        <Text style={styles.textButton}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  customButton: {
    flexDirection: 'row', // Adicionando flexDirection para alinhar ícone e texto na mesma linha
    backgroundColor: '#f2c40e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center', // Alinhando os itens verticalmente
    justifyContent: 'center', // Centralizando os itens horizontalmente
  },
  container: {
    borderRadius: 20,
    marginVertical: 8,
    width: 200,
    alignSelf: 'center',
    display: 'flex',
  },
  textButton: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 8, // Adicionando margem à esquerda para separar o ícone do texto
  },
  icon: {
    marginRight: 8, // Adicionando margem à direita para separar o ícone do texto
  },
});

export default AdicionarBtn;
