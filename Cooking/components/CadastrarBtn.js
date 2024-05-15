import { Pressable, View, Text, StyleSheet } from "react-native"

const CadastrarBtn = ({title, onPress}) => {
  return (
    <Pressable  style={styles.tHButton} onPress={onPress}>
        <View style={styles.customButton}>
            <Text style={styles.textButton}>{title}</Text>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    customButton: {
        backgroundColor: "#FF421D",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 28,
        
      },
      tHButton: {
        borderRadius: 20,
        marginVertical: 8,
        width: 160,
        alignSelf:  'center'
      },
      textButton: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: "Poppins_900Black"
      }
})

export default CadastrarBtn