import React from 'react';
import {TextInput, View, StyleSheet, Dimensions, Text} from 'react-native';

import Colors from '../constants/Colors';

// const Width = Dimensions.get('screen').width * 0.9;

export default class MyInputText extends React.Component {
  render() {
    return (
      <TextInput
        {...this.props}
        style={{
          ...styles.input,
          ...this.props.style,
        }}
        placeholderTextColor={Colors.grayColor}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    marginTop: 16,
    fontSize: 20,
    color: Colors.blackColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
