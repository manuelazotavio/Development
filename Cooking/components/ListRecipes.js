import {View, StyleSheet, FlatList, Text, Platform} from 'react-native'
import { useEffect, useState } from 'react'
import CardRecipe from './CardRecipe.js'
import authFetch from '../helpers/authFetch.js'

const ListRecipes = ({recipes}) => {
  return (
    
          <View style={styles.listRecipes}>
            <FlatList
              data={recipes}
              horizontal={true}
              keyExtractor={(item) => item.id}
              //showsHorizontalScrollIndicator={false}
              renderItem={({item}) => <CardRecipe recipe={item} />} 
            />
          </View>
      );
  
}

const styles = StyleSheet.create({
    listRecipe:{
      //display: 'flex',
      maxWidth: '100%',
      //alignItems: 'center',
      //maxHeight: Platform.OS === 'web' ? '90vh' : null
    },
    flatListRecipe: {
      alignSelf: 'center'
    }
  }
)

export default ListaReceitas
