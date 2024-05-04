import {View, StyleSheet, FlatList, Text, Platform} from 'react-native'
import { useEffect, useState } from 'react'
import CardReceita from './CardReceita.js'

const Body = () => {

  const [receitas, setReceitas] = useState([])

  const getReceitas = async () => {
    try{
      const result = await fetch('https://backcooking.onrender.com/receita')
      const data = await result.json()
      console.log(data.success)
      setReceitas(data.receitas)
    } catch (error){
      console.log('Error getReceitas ' + error.message)
    }
  }

  useEffect(()=>{
    getReceitas()
  },[])


  return (
    <View style={{flex: 1}}>
        
        <View style={styles.listReceita}>
            {receitas.length ? 
              <FlatList
                style={{width: '100%'}}
                data={receitas}
                renderItem={({item}) => <CardReceita receita={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.flatListReceita}
              /> : 
              <Text style={{color: '#FFF'}}>Loading...</Text>}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    listReceita:{
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
      maxHeight: Platform.OS === 'web' ? '90vh' : null
    },
    flatListReceita: {
      alignSelf: 'center'
    }
  }
)

export default Body