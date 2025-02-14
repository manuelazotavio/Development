import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

const AddBtn = ({ title, onPress }) => {
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
    flexDirection: 'row',
    backgroundColor: '#f2c40e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center', 
    justifyContent: 'center',
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
    marginLeft: 8, 
  },
  icon: {
    marginRight: 8,
  },
});

export default AddBtn;
