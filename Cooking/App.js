import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CriarReceita from './screens/CriarReceita';
import { Feather } from '@expo/vector-icons'
import Receita from './screens/Receita';
import Cadastrar from './screens/Cadastrar';
import Products from './screens/Conta';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Login from './screens/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const ReceitaNavigator = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Principal" component={ListUser} /> */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false
        }} />
      <Stack.Screen
        name="Receita"
        component={Receita}
        options={{
          headerShown: false
        }} />
    </Stack.Navigator>
  )
}

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false
    }}>
      <Tab.Screen
        name="Receita"
        component={ReceitaNavigator}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="home" color={{color: "#000"}} size={25} />
          )
        }}
      />
      <Tab.Screen name="CriarReceita" component={CriarReceita} options={{
        tabBarIcon: () => (
          <Feather name="plus-square" size={24} color="black" />
        )
      }}/>
      <Tab.Screen name="Login" component={Login} options={{
        tabBarIcon: () => (
          <Feather name="user" size={24} color="black" />
        )
      }} />
    </Tab.Navigator>
  )
}




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash} 
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
          name="Cadastrar"
          component={Cadastrar}
          options={{
            title: "Cadastrar User"
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            headerShown: false
          }}
        />
        
        
    </Stack.Navigator>
      {/* <Drawer.Navigator>
        <Drawer.Screen name="Principal" component={ListUser} />
        <Drawer.Screen name="Cadastrar" component={Cadastrar} />
      </Drawer.Navigator> */}
    </NavigationContainer>
  )
}
