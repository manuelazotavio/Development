import {View, StyleSheet, FlatList, Text, Platform} from 'react-native'
import { useEffect, useState } from 'react'
import CardReceita from './CardReceita.js'

const Body = (receita) => {

  const [receitas, setReceitas] = useState([])

  const getReceitas = async () => {
    try{
      const result = await fetch('https://backcooking.onrender.com/receita')
      const data = await result.json()
      console.log(data)
      console.log(data.success)
      setReceitas(data.receita)
    } catch (error){
      console.log('Error getReceitas ' + error.message)
    }
  }

  useEffect(()=>{
    getReceitas()
  },[])

  console.log(receitas)

  return (
    
        <View style={{flex: 1}}>
          <View style={styles.listReceita}>
            <FlatList
              data={receitas}
              horizontal={true}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => <CardReceita receita={item} />} 
            />
          </View>
        </View>
      );
  
}

const styles = StyleSheet.create({
    listReceita:{
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      maxHeight: Platform.OS === 'web' ? '90vh' : null
    },
    flatListReceita: {
      alignSelf: 'center'
    }
  }
)

export default Body