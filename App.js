import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Item from './components/Item'
import Scanner from './components/Scanner';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import useDatabase from './hooks/useDatabase'
import LoopDatabase from './components/LoopDatabase'
	

export default function App() {
  SplashScreen.preventAutoHideAsync(); //don't let the splash screen hide


  const isDBLoadingComplete = useDatabase();

  if (isDBLoadingComplete) {
    SplashScreen.hideAsync();
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
            <Tab.Screen name="Database" component={LoopDatabase} />
          
        </Tab.Navigator>
      </NavigationContainer>
  );
} else {
  return null;
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ba1c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
