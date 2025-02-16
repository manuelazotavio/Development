import {View, StyleSheet, FlatList, Text, Platform} from 'react-native'
import { useEffect, useState } from 'react'
import CardRecipe from './CardRecipe.js'


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

      maxWidth: '100%',
    
    },
    flatListRecipe: {
      alignSelf: 'center'
    }
  }
)

export default ListRecipes
