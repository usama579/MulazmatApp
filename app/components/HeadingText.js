import React from 'react';
import {Text, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import FontAndSize from '../constants/FontAndSize';

const HeadingText = props => {
  return <Text {...props} style={{...styles.headingText, ...props.style}} />;
};

const styles = StyleSheet.create({
  headingText: {
    fontWeight: 'bold',
    color: Colors.blackColor,
    fontSize: FontAndSize.headingTxtSize,
  },
});

export default HeadingText;
