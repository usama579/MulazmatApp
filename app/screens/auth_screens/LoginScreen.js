import React, {useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

import HeadingText from '../../components/HeadingText';

import Paddings from '../../constants/Paddings';
import Colors from '../../constants/Colors';
import MyTextInput from '../../components/MyTextInput';
import MyButton from '../../components/MyButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import NormalText from '../../components/NormalText';
import SmallText from '../../components/SmallText';
import PasswordInput from '../../components/PasswordInput';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import routes from '../../navigation/routes';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = props => {
  //States
  const [loading, setLoading] = useState(false);

  //Email
  const [userEmail, setUserEmail] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [emailErrorVisibility, setEmailErrorVisibility] = useState(false);

  //Password
  const [userPassword, setUserPassword] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [passwordErrorVisibility, setPasswordErrorVisibility] = useState(false);

  const onEmailChange = text => {
    if (emailErrorVisibility) setEmailErrorVisibility(false);
    setUserEmail(text);
  };

  const onPasswordChange = text => {
    if (passwordErrorVisibility) setPasswordErrorVisibility(false);
    setUserPassword(text);
  };

  const emailErrorHandler = (visibility, text) => {
    setEmailErrorText(text);
    setEmailErrorVisibility(visibility);
  };

  const passwordErrorHandler = (visibility, text) => {
    setPasswordErrorText(text);
    setPasswordErrorVisibility(visibility);
  };

  const isUserEnteredInfoRight = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (userEmail === '') {
      emailErrorHandler(true, 'Please Enter Email First');
      return false;
    } else if (reg.test(userEmail) === false) {
      emailErrorHandler(true, 'Please Enter Right Email');
      return false;
    } else if (userPassword === '') {
      passwordErrorHandler(true, 'Please Enter Password First');
      return false;
    } else if (userPassword.length < 8) {
      passwordErrorHandler(true, 'Please Should Contain 8 digits At Least');
      return false;
    } else {
      //if every things is right then send login request to server
      return true;
    }
  };

  const sendLoginRequestToServer = async () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        // getUserData(userCredentials?.user?.uid);
        if(userCredentials.user.emailVerified){
        getUserData(userCredentials.user?.uid)
        }else {
          setLoading(false)
          auth().signOut()
          showAlertToUserThatEmailIsNotVerified();
        }
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }
        alert('Something went wrong', error);
        console.error(error);
      });
  };

  const showAlertToUserThatEmailIsNotVerified = () =>
    Alert.alert(
      'Email Not Verified',
      `we sent a mail to your ${userEmail}. \nPlease verify your email by clicking the verify link. And then you can login to your account`,
      [
        {
          text: 'OK',
          onPress: () =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!')),
        },
      ],
    );

  const getUserData = async userUid => {
    firestore()
      .collection('Users')
      .where('uid', '==', userUid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
          let {isEmployer} = snapshot.data();
          _saveDataIntoAsyncAndLunchDrawer(isEmployer);
        });
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  //SaveDataInto Async Storage
  const _saveDataIntoAsyncAndLunchDrawer = isEmployer => {
    AsyncStorage.setItem('isEmployer', JSON.stringify(isEmployer))
      .then(() => props.navigation.replace(routes.DRAWER))
      .catch(e => console.log(e));
    setLoading(false);
  };

  const _handleLoginProcess = () => {
    if (isUserEnteredInfoRight()) {
      sendLoginRequestToServer();
    }
  };

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const renderHeader = () => {
    return (
      <View style={styles.headerCNTR}>
        {/* Mploya Login */}
        <HeadingText style={styles.headingTxt}>Mulazmat</HeadingText>
        {/* Login With Your Mploya */}
        <NormalText style={styles.loginWithTxt}>
          Login With Your Mulazmat Account
        </NormalText>
      </View>
    );
  };

  const renderInputForm = () => {
    {
      /* Form */
    }
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
        }}>
        <MyTextInput
          placeholder={'Email'}
          value={userEmail}
          onChangeText={onEmailChange}
          selectionColor={Colors.primaryColor}
          numberOfLines={1}
        />
        {emailErrorVisibility ? (
          <SmallText style={styles.helperTxt} type="error">
            {emailErrorText}
          </SmallText>
        ) : null}

        <PasswordInput
          selectionColor={Colors.primaryColor}
          placeholder={'Password'}
          numberOfLines={1}
          value={userPassword}
          onChangeText={onPasswordChange}
        />

        {passwordErrorVisibility ? (
          <Text style={styles.helperTxt} type="error">
            {passwordErrorText}
          </Text>
        ) : null}

        {
          //forgot password
        }
        <View style={styles.forgotTxtCNTR}>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate(routes.FORGOT_PASSWORD_SCREEN);
            }}>
            {/* Forgot Password */}
            <Text style={{color: Colors.primaryColor}}>Forgot Password?</Text>
          </TouchableCmp>
        </View>
        {
          //Login Button
        }
        <MyButton title="Login" onPress={_handleLoginProcess} />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <LoadingIndicator loading={loading} />
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{height: '30%', width: '100%', marginTop: 20}}>
        <Image
          style={styles.logoImg}
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
        />
      </View>
      {renderHeader()}
      {renderInputForm()}
      <View style={styles.createTxt}>
        <NormalText style={{marginRight: 4}}>
          Create An Account if have't already
        </NormalText>
        <TouchableCmp
          onPress={() =>
            props.navigation.navigate(routes.CREATE_ACCOUNT_SCREEN)
          }>
          <NormalText
            style={{
              marginLeft: 4,
              fontWeight: 'bold',
              color: Colors.primaryColor,
            }}>
            Sign Up
          </NormalText>
        </TouchableCmp>
      </View>
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
  logoImg: {
    width: '100%',
    height: '100%',
  },
  headerCNTR: {
    width: '100%',
    alignItems: 'center',
  },
  helperTxt: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: Colors.redColor,
    marginTop: 1,
    marginLeft: 5,
  },
  headingTxt: {
    marginTop: '10%',
    width: '100%',
    color: Colors.primaryColor,
  },
  loginWithTxt: {
    width: '100%',
  },
  btnCNTR: {
    width: 150,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.blackColor,
    shadowOpacity: 1,
    shadowOffset: {width: 10, height: 4},
  },
  selectedAccountBG: {
    backgroundColor: Colors.primaryColor,
    elevation: 10,
    shadowColor: Colors.blackColor,
    shadowOpacity: 1,
  },
  btnTouchArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switcherIcon: {
    backgroundColor: Colors.whiteColor,
    color: Colors.whiteColor,
  },
  verticalLine: {
    width: 1,
    height: '70%',
    marginHorizontal: 8,
    backgroundColor: Colors.blackColor,
  },
  activeVerticalLine: {
    backgroundColor: Colors.whiteColor,
  },
  switcherName: {
    fontSize: 18,
    color: Colors.blackColor,
  },
  activeSwitcherName: {
    color: Colors.whiteColor,
  },
  forgotTxtCNTR: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  createTxt: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
