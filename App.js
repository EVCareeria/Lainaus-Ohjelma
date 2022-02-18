import React, { useState } from 'react';
import {useColorScheme, View, Switch, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Guide from './components/Guide';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { createStackNavigator } from '@react-navigation/stack';

import Scanner from './components/Scanner';
import Item from './components/Item';
import ViewItems from './components/Pages/ViewItems';
import HomeScreen from './components/Homescreen';

const Stack = createStackNavigator();

const darkTheme = {
  dark: true,
  colors: {
    primary: '#3b4543',
    background: '#0d0e12',
    text: '#e6e6e6',
    icon: '#aac7f0'
  },
};
const lightTheme = {
  dark: false,
  colors: {
    primary: '#f5e2c6',
    background: '#e1ebeb',
    text: '#332600',
    icon: '#303b4a'
  },
};

export function ScannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="Item" component={Item} />
      <Stack.Screen name="ViewItems" component={ViewItems} />
    </Stack.Navigator>
  );
}


export default function App() {
  const [mode, setMode] = useState(false)
  const scheme = useColorScheme();

  let [fontLoaded, error] = useFonts({
    RobotoMedium: require('./assets/Fonts/Roboto-Medium.ttf'),
    RobotoMono: require('./assets/Fonts/RobotoMono-ExtraLight.ttf'),
    AssistantLight: require('./assets/Fonts/Assistant-Light.ttf'),
    AssistantMedium: require('./assets/Fonts/Assistant-Medium.ttf'),
  });

  if(!fontLoaded) {
    return <AppLoading />
  }

  const Tab = createBottomTabNavigator();
    return (
      <NavigationContainer theme={mode === false ? darkTheme : lightTheme} >
        <View style={{paddingTop:'5%', marginTop:'5%', display:'flex', flexDirection:'row', alignSelf:'flex-end', zIndex:10}} >
          <Text style={{textAlign:'right', paddingRight:'10%'}} >{mode === false ? 'Change to light mode' : 'Change to dark mode'}</Text>
          <Switch value={mode} onChange={() => setMode((value) => !value) } />
        </View>
        <Tab.Navigator
          tabBarOptions={{
            showLabel: true,
            inactiveBackgroundColor: 'grey',
            activeTintColor: 'green',
            labelStyle: { fontSize: 28 }
          }}
        >
          <Tab.Screen name="Guide" component={Guide} />
          <Tab.Screen name="Home" component={ScannerStack} />
        </Tab.Navigator>
      </NavigationContainer>
    );
}
