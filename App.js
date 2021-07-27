import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Item from './components/Item'
import Scanner from './components/Scanner';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
//import useDatabase from './hooks/useDatabase'
import HomeScreen, { ScannerStack } from './components/Homescreen';
import ViewItems from './components/Pages/ViewItems';
import Calendar from './components/Calendar'
	

export default function App() {
  //SplashScreen.preventAutoHideAsync(); //don't let the splash screen hide


  //const isDBLoadingComplete = useDatabase();

  /* if (isDBLoadingComplete) {
    SplashScreen.hideAsync(); */
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
            <Tab.Screen name="Home" component={ScannerStack} />
            <Tab.Screen name="Item" component={Item} />
            <Tab.Screen name="View Items" component={ViewItems} />
            <Tab.Screen name="Calendar" component={Calendar} />
          
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
