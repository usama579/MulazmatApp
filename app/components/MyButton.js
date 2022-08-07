import React from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import Colors from '../constants/Colors';

const MyButton = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={{...styles.container, ...props.style}}>
      <TouchableCmp
        style={{flex: 1, overflow: 'hidden'}}
        onPress={props.onPress}>
        <View style={styles.touchArea}>
          {props.children}
          <Text style={{...styles.text, ...props.titleStyle}}>
            {props.title}
          </Text>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: Colors.primaryColor,
    shadowColor: Colors.blackColor,
    shadowOffset: {width: 8, height: 3},
    shadowOpacity: 0.2,
    elevation: 4,
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    // fontFamily: 'SFPro-Regular',
    textAlign: 'center',
    color: Colors.whiteColor,
  },
});

export default MyButton;
