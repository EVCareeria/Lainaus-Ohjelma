import React, { } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ScannerStack } from './components/Homescreen';
import Guide from './components/Guide';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';


export default function App() {

  let [fontLoaded, error] = useFonts({
    RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf'),
    RobotoMono: require('./assets/fonts/RobotoMono-ExtraLight.ttf'),
    AssistantLight: require('./assets/fonts/Assistant-Light.ttf'),
    AssistantMedium: require('./assets/fonts/Assistant-Medium.ttf'),
  })

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
