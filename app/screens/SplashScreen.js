import React, {useEffect} from 'react';
import { View, StyleSheet, Image, StatusBar } from "react-native";

import Paddings from '../constants/Paddings';
import Colors from '../constants/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';

import routes from '../navigation/routes';

const SplashScreen = props => {
  useEffect(() => {
    setTimeout(() => {
    AsyncStorage.getItem('isEmployer').then(user => {
      if(user === null){
        props.navigation.replace(routes.LOGIN_SCREEN);
      }else {
        props.navigation.replace(routes.DRAWER)
      }
    }).catch(e => console.log(e))
    }, 2000);
  },[])

  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle="light-content"
      />
      <Image
        style={styles.logoImg}
        source={require('../assets/images/logo.png')}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Paddings.normalPadding,
  },
  logoImg: {
    width: '90%',
    height: '40%',
  },
});
export default SplashScreen;
