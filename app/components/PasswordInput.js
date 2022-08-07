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

import Colors from '../constants/Colors';

const PasswordInput = props => {
  const [showHideText, setShowHideText] = React.useState('Show');
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={{...styles.passwordInputCNTR, ...props.style}}>
      <TextInput
        {...props}
        autoCorrect={false}
        style={styles.passwordInput}
        placeholderTextColor={Colors.grayColor}
        secureTextEntry={passwordVisibility}
      />
      <TouchableCmp
        onPress={() => {
          setPasswordVisibility(!passwordVisibility);
          showHideText === 'Show'
            ? setShowHideText('Hide')
            : setShowHideText('Show');
        }}>
        <Text>{showHideText}</Text>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordInputCNTR: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
    shadowColor: Colors.blackColor,
    shadowOffset: {width: 8, height: 3},
    shadowOpacity: 0.2,
    elevation: 2,
  },
  passwordInput: {
    height: 50,
    flex: 1,
    fontSize: 20,
    color: Colors.blackColor,
  },
});
export default PasswordInput;
