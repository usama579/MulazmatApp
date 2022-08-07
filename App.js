import React from 'react';
import 'react-native-gesture-handler';
import Navigation from './app/navigation/AppNavigation';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
