import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Text,
  TextInput,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';

const SearchInput = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.passwordInputCNTR}>
      <TextInput
        {...props}
        style={styles.passwordInput}
        placeholderTextColor={Colors.grayColor}
        placeholder="Search"
      />
      <TouchableCmp onPress={() => {}}>
        <Ionicons name="ios-filter" size={18} color={Colors.blackColor} />
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordInputCNTR: {
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: Colors.whiteColor,
    elevation: 2,
    shadowColor: Colors.blackColor,
  },
  passwordInput: {
    height: 50,
    flex: 1,
    fontSize: 20,
    color: Colors.blackColor,
  },
});
export default SearchInput;
