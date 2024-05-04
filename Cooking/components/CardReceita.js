import {Text, View, StyleSheet, Pressable} from 'react-native'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'

const CardReceita = ({receita}) => {

  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.navigate('Receita', {receita})}>
        <View style={styles.card}>
            <View style={styles.foto}>
                <Image
                    style={styles.fotoImg}
                    source={"https://fakeimg.pl/600x400"}
                />
                <Text>{receita.name}</Text>
            </View>
            <View>
            <Feather name="clock" color={{color: "#000"}} size={10} />
            <Feather name="star" color={{color: "#000"}} size={10} />
            <Feather name="user" color={{color: "#000"}} size={10} />
            </View>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 300,
        height: 100,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 10
    },
    avatar: {
        marginHorizontal: 10
    },
    avatarImg: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
})

export default CardReceita