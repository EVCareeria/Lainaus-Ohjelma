import React, {useContext, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Item from './components/Item'
import Scanner from './components/Scanner';
import { DataContext } from './components/ItemContext';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


export function CodeContenxt({}) {
}

export default function App() {
  
  const Tab = createBottomTabNavigator();


  return (
      <NavigationContainer>
        <Tab.Navigator
        tabBarOptions={{
        showLabel: true,
        inactiveBackgroundColor: 'white',
        activeTintColor: '#4adebe',
        labelStyle: {fontSize: 24}
        }}
        >
          
            <Tab.Screen name="Item" component={Item} />
            <Tab.Screen name="Skanneri" component={Scanner} />
          
          
        </Tab.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ba1c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
