import {View, StyleSheet, FlatList, Text, Platform} from 'react-native'
import { useEffect, useState } from 'react'
import CardReceita from './CardReceita.js'
import authFetch from '../helpers/authFetch.js'

const ListaReceitas = ({receitas}) => {
  return (
    
          <View style={styles.listReceita}>
            <FlatList
              data={receitas}
              horizontal={true}
              keyExtractor={(item) => item.id}
              //showsHorizontalScrollIndicator={false}
              renderItem={({item}) => <CardReceita receita={item} />} 
            />
          </View>
      );
  
}

const styles = StyleSheet.create({
    listReceita:{
      //display: 'flex',
      maxWidth: '100%',
      //alignItems: 'center',
      //maxHeight: Platform.OS === 'web' ? '90vh' : null
    },
    flatListReceita: {
      alignSelf: 'center'
    }
  }
)

export default ListaReceitas