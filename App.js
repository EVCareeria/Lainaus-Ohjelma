import React, { } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ScannerStack } from './components/Homescreen';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';


export default function App() {

  let [fontLoaded, error] = useFonts({
    RobotoMedium: require('./assets/Fonts/Roboto-Medium.ttf'),
    RobotoMono: require('./assets/Fonts/RobotoMono-ExtraLight.ttf'),
    AssistantLight: require('./assets/Fonts/Assistant-Light.ttf'),
    AssistantMedium: require('./assets/Fonts/Assistant-Medium.ttf'),
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
            inactiveBackgroundColor: 'white',
            activeTintColor: '#4adebe',
            labelStyle: { fontSize: 24 }
          }}
        >
          <Tab.Screen name="Home" component={ScannerStack} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  

}
