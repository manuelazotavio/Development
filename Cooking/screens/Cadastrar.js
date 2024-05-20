import { useState } from 'react'
import {View, Text, TextInput, StyleSheet, ScrollView} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import CadastrarBtn from '../components/CadastrarBtn'


const Cadastrar = () => {
    const navigation = useNavigation()

    const [txtName, setTxtName] = useState('')
    const [txtEmail, setTxtEmail] = useState('')
    const [txtAvatar, setTxtAvatar] = useState('')
    const [txtPass, setTxtPass] = useState('')

    const postUser = async () =>{
        try{
          //const result = await fetch('https://backend-api-express-1sem2024-rbd1.onrender.com/user', {
          const result = await fetch('https://backcooking.onrender.com/user', {
            method: "POST",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({name: txtName, email: txtEmail, pass: txtPass, avatar: txtAvatar})
          })
          const data = await result.json()
          console.log(data)
          if(data?.success){
            navigation.goBack()
          } else {
            alert(data.error)
          }
        } catch (error){
          console.log('Error postUser ' + error.message)
          alert(error.message)
        }
      } 

    return (
      <View style={{backgroundColor: "#fff", width: "100%", flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Cadastrar</Text>
            <View style={styles.form}>
                <TextInput 
                style={styles.input}
                placeholder='Nome...'
                onChangeText={setTxtName}
                value={txtName}
                />
                <TextInput 
                style={styles.input}
                placeholder='Email...'
                onChangeText={setTxtEmail}
                value={txtEmail}
                />
                <TextInput 
                style={styles.input}
                placeholder='Senha...'
                onChangeText={setTxtPass}
                value={txtPass}
                />
                <TextInput 
                style={styles.input}
                placeholder='Avatar...'
                onChangeText={setTxtAvatar}
                value={txtAvatar}
                />
                <CadastrarBtn 
                    title="Cadastrar"
                    onPress={postUser}
                />
            </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: "#fff"
},
input: {
  height: 40,
  width: "100%",
  backgroundColor: "#ededed",
  marginBottom: 10,
  marginTop: 5,
  padding: 10,
  borderRadius: 10,

},
    form: {
        display: 'flex',
      width: "80%"
    },

    titulo: {
      fontFamily: "Poppins_900Black",
      fontSize: 20,
      marginTop: 40,
      marginLeft: 5,
      marginBottom: 10,
      alignSelf: "flex-start",
      justifyContent: 'flex-start'
    },
    
})

export default Cadastrar