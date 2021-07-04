import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Items from './components/Items'
import Scanner from './components/Scanner';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';




export default function App() {
  const Tab = createBottomTabNavigator ();

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
          <Tab.Screen name="Laitteet" component={Items} />
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
