import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

import Paddings from '../../constants/Paddings';
import Colors from '../../constants/Colors';
import MyButton from '../../components/MyButton';
import NormalText from '../../components/NormalText';
import SmallText from '../../components/SmallText';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MyInputText from '../../components/MyTextInput';

import lang from '../../constants/DefaultLanguage';
import auth, { firebase } from "@react-native-firebase/auth";
import LoadingIndicator from "../../components/LoadingIndicator";

const ForgotPasswordScreen = props => {
  const [loading, setLoading] = useState(false)
  //States
  const [userEmail, setEmail] = React.useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [emailErrorVisibility, setEmailErrorVisibility] = useState(false);

  const onChangeText = text => {
    setEmail(text);
    if (emailErrorVisibility) {
      setEmailErrorVisibility(false);
    }
  };

  const emailErrorHandler = (visibility, text) => {
    setEmailErrorText(text);
    setEmailErrorVisibility(visibility);
  };

  const _isUserEnteredEmailRight = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (userEmail === '') {
      emailErrorHandler(true, lang.l139 + ' ' + lang.l11);
      return false;
    } else if (reg.test(userEmail) === false) {
      emailErrorHandler(true, lang.l139 + ' ' + lang.l144 + ' ' + lang.l11);
      return false;
    } else {
      //if every things is right then send login request to server
      forgotPassword(userEmail)
    }
  };

  const forgotPassword = (Email) => {
    setLoading(true)
    firebase.auth().sendPasswordResetEmail( Email, null)
      .then(() => {
        Alert.alert(
          'SuccessFull',
          "Password Reset email sent to " + Email,
          [
            {
              text: 'OK',
              onPress: () =>
               props.navigation.pop()
            },
          ],
        );
      })
      .catch(function (e) {
        alert(e.message)
      });
        setLoading(false)
  };

  return (
    <View style={styles.screen}>
      <LoadingIndicator loading={loading} />
      <View style={{width: '100%'}}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.primaryColor} size={30} />
        </TouchableOpacity>
      </View>
      <Image
        style={styles.forgotPassword}
        resizeMode="contain"
        source={require('../../assets/images/fpass.png')}
      />
      <NormalText style={{fontSize: 22, marginTop: 15, fontWeight: 'bold'}}>
        {lang.l13}
      </NormalText>
      <NormalText
        style={{textAlign: 'center', marginTop: 10, color: Colors.grayColor}}>
        {lang.l22}
      </NormalText>
      <MyInputText
        placeholder={lang.l11}
        value={userEmail}
        onChangeText={onChangeText}
        selectionColor={Colors.primaryColor}
        numberOfLines={1}
      />
      {emailErrorVisibility ? (
        <SmallText style={{color: Colors.redColor, width: '95%', marginTop: 3}}>
          {emailErrorText}
        </SmallText>
      ) : null}
      <MyButton title={lang.l94} onPress={_isUserEnteredEmailRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    alignItems: 'center',
    padding: Paddings.normalPadding,
    paddingTop: Platform.OS === 'ios' ? 47 : null, //leaving the status bar space
  },
  forgotPassword: {
    width: '100%',
    height: '45%',
    marginTop: '20%',
  },
});
export default ForgotPasswordScreen;
