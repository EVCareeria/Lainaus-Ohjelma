import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ScannerStack } from './components/Homescreen';
import Guide from './components/Guide';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import {ScreenOrientationInfo} from 'expo-screen-orientation'


export default function App() {
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
      <NavigationContainer>
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
