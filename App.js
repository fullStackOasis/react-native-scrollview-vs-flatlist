import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './MainScreen';
import HomeScreen from './HomeScreen';
import FlatMainScreen from './FlatMainScreen';

if (!__DEV__) {
  console = {};
  console.log = () => {};
  console.error = () => {};
  console.assert = () => {};
}

const Stack = createNativeStackNavigator();
//const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="FlatMain" component={FlatMainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
