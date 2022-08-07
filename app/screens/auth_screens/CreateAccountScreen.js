import React, { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import HeadingText from "../../components/HeadingText";

import Paddings from "../../constants/Paddings";
import Colors from "../../constants/Colors";
import MyButton from "../../components/MyButton";
import NormalText from "../../components/NormalText";
import MyTextInput from "../../components/MyTextInput";
import PasswordInput from "../../components/PasswordInput";

import LoadingIndicator from "../../components/LoadingIndicator";

import "../../constants/GlobalHelperFunctions";

import Ionicons from "react-native-vector-icons/Ionicons";

import lang from "../../constants/DefaultLanguage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const CreateAccountScreen = props => {
  //States
  const [loading, setLoading] = useState(false);
  const [selectedAccountType, setSelectAccountType] = useState(1);
  //Name
  const [userName, setUserName] = useState('');
  const [nameErrorTxt, setNameErrorTxt] = useState('');
  const [nameErrorVisibility, setNameErrorVisibility] = useState(false);
  //Email
  const [userEmail, setUserEmail] = useState('');
  const [emailErrorTxt, setEmailErrorTxt] = useState('');
  const [emailErrorVisibility, setEmailErrorVisibility] = useState(false);
  const [userSkill, setUserSkill] = useState('');
  const [skillErrorTxt, setSkillErrorTxt] = useState('');
  const [skillErrorVisibility, setSkillErrorVisibility] = useState(false);
  //Password
  const [userPassword, setUserPassword] = useState('');
  const [passwordErrorTxt, setPasswordErrorTxt] = useState('');
  const [passwordErrorVisibility, setPasswordErrorVisibility] = useState(false);
  //Confirmed Password
  const [userCPassword, setUserCPassword] = useState('');
  const [cPasswordErrorTxt, setCPasswordErrorTxt] = useState('');
  const [cPasswordErrorVisibility, setCPasswordErrorVisibility] =
    useState(false);

  const switchButtonsList = [
    {
      id: 1,
      icon: 'ios-briefcase',
      title: lang.l9,
    },
    {
      id: 2,
      icon: 'ios-man',
      title: lang.l10,
    },
  ];

  const clearAllState = () => {
    setUserSkill('');
    setUserPassword('');
    setUserCPassword('');
    setUserEmail('');
    setUserName('');
  };

  //Input Handling
  const onNameChange = text => {
    if (nameErrorVisibility) setNameErrorVisibility(false);
    setUserName(text);
  };
  const onEmailChange = text => {
    if (emailErrorVisibility) setEmailErrorVisibility(false);
    setUserEmail(text);
  };
  const onPasswordChange = text => {
    if (passwordErrorVisibility) setPasswordErrorVisibility(false);
    setUserPassword(text);
  };

  const onConfirmPasswordChange = text => {
    if (cPasswordErrorVisibility) setCPasswordErrorVisibility(false);
    setUserCPassword(text);
  };

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const isUserEnteredInfoRight = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (userName === '') {
      setNameErrorTxt(lang.l198);
      setNameErrorVisibility(true);
      return false;
    } else if (userEmail === '') {
      setEmailErrorTxt(lang.l139 + ' ' + lang.l11);
      setEmailErrorVisibility(true);
      return false;
    } else if (reg.test(userEmail) === false) {
      setEmailErrorTxt(lang.l139 + ' ' + lang.l144 + ' ' + lang.l11);
      setEmailErrorVisibility(true);
      return false;
    } else if (userSkill === '' && selectedAccountType === 1) {
      setSkillErrorTxt('Please Enter Your Skill');
      setSkillErrorVisibility(true);
      return false;
    } else if (userPassword === '') {
      setPasswordErrorTxt(lang.l139 + ' ' + lang.l12);
      setPasswordErrorVisibility(true);
      return false;
    } else if (userPassword.length < 8) {
      setPasswordErrorTxt(lang.l141);
      setPasswordErrorVisibility(true);
      return false;
    } else if (userCPassword === '') {
      setCPasswordErrorTxt(lang.l139 + ' ' + lang.l20);
      setCPasswordErrorVisibility(true);
      return false;
    } else if (userPassword !== userCPassword) {
      setCPasswordErrorTxt(lang.l142);
      setCPasswordErrorVisibility(true);
    } else {
      _sendDataToServer();
    }
  };

  const _sendDataToServer = () => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        //send Verify Email To user
        userCredentials.user
          .sendEmailVerification()
          .then(r => console.log(r))
          .catch(err => console.log({err}));
        // User account created & signed in! And Also updating display name of user
        updateDisplayName(userCredentials);
        //added on user Collection with uid that this user is Employer or Jobber
        createUserOnFirestore(userCredentials?.user?.uid);
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }
        alert('Something went wrong', error);
        console.error(error);
      });
  };

  const updateDisplayName = userCredentials => {
    if (userCredentials.user) {
      userCredentials.user
        .updateProfile({
          displayName: userName,
        })
        .then(s => {
          console.log('name updated!');
        })
        .catch(e => console.error(e));
    }
  };

  const createUserOnFirestore = userId => {
    const data =
      selectedAccountType === 1
        ? {
            isEmployer: selectedAccountType === 2,
            uid: userId,
            name: userName,
            skill: userSkill,
            email: userEmail,
          }
        : {
            isEmployer: selectedAccountType === 2,
            uid: userId,
            name: userName,
            email: userEmail,
          };

    firestore()
      .collection('Users')
      .doc(userId)
      .set(data)
      .then(() => {
        showAlertOfEmailConfirmation();
        setLoading(false);
      });
  };

  const showAlertOfEmailConfirmation = () =>
    Alert.alert(
      'Verify Your Email',
      `we sent a mail to your ${userEmail}. \nPlease verify your email by clicking the verify link. And then you can login to your account`,
      [{text: 'OK', onPress: () => props.navigation.pop()}],
    );

  const renderHeadingTxt = () => {
    return (
      <View style={styles.headingCNTR}>
        {/* Welcome to */}
        <NormalText>{lang.l18}</NormalText>
        <HeadingText style={{color: Colors.primaryColor}}>
          {/* Mploya  */}
          {lang.l123}
        </HeadingText>

        <View style={styles.loginSwitchBtnCNTR}>
          {_renderAccountSwitchButton()}
        </View>
      </View>
    );
  };

  const _renderAccountSwitchButton = () => {
    return switchButtonsList.map(e => (
      <View
        key={e.id}
        style={[
          styles.btnCNTR,
          selectedAccountType === e.id && styles.selectedAccountBG,
        ]}>
        <TouchableCmp
          style={{flex: 1}}
          onPress={() => setSelectAccountType(e.id)}>
          <View style={styles.btnTouchArea}>
            <Ionicons name={e.icon} size={24} color={Colors.whiteColor} />
            <View style={styles.verticalLine} />
            <Text style={styles.switcherName}>{e.title}</Text>
          </View>
        </TouchableCmp>
      </View>
    ));
  };

  const renderInputForm = () => {
    {
      /* Form */
    }
    return (
      <View style={styles.formCNTR}>
        <MyTextInput
          placeholder={lang.l19}
          value={userName}
          onChangeText={onNameChange}
          selectionColor={Colors.primaryColor}
          numberOfLines={1}
        />
        {nameErrorVisibility ? (
          <Text style={styles.helperTxt}>{nameErrorTxt}</Text>
        ) : null}
        <MyTextInput
          placeholder={lang.l11}
          value={userEmail}
          onChangeText={onEmailChange}
          selectionColor={Colors.primaryColor}
          numberOfLines={1}
        />
        {emailErrorVisibility ? (
          <Text style={styles.helperTxt}>{emailErrorTxt}</Text>
        ) : null}

        {selectedAccountType === 1 && (
          <>
            <MyTextInput
              placeholder={'Skill'}
              value={userSkill}
              onChangeText={text => setUserSkill(text)}
              selectionColor={Colors.primaryColor}
              numberOfLines={1}
            />
            {skillErrorVisibility ? (
              <Text style={styles.helperTxt}>{skillErrorTxt}</Text>
            ) : null}
          </>
        )}

        <PasswordInput
          placeholder={lang.l12}
          value={userPassword}
          onChangeText={onPasswordChange}
          selectionColor={Colors.primaryColor}
          numberOfLines={1}
        />
        {passwordErrorVisibility ? (
          <Text style={styles.helperTxt}>{passwordErrorTxt}</Text>
        ) : null}
        {/* Confirm Password */}

        <PasswordInput
          placeholder={lang.l20}
          value={userCPassword}
          onChangeText={onConfirmPasswordChange}
          selectionColor={Colors.primaryColor}
          numberOfLines={1}
        />
        {cPasswordErrorVisibility ? (
          <Text style={styles.helperTxt}>{cPasswordErrorTxt}</Text>
        ) : null}
        <MyButton title={lang.l17} onPress={isUserEnteredInfoRight} />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <LoadingIndicator loading={loading} />
      {renderHeadingTxt()}
      {renderInputForm()}

      <View style={styles.createTxt}>
        <NormalText style={{marginRight: 4}}>
          Already have an account?
        </NormalText>
        <TouchableCmp
          onPress={() => props.navigation.pop()}>
          <NormalText
            style={{
              marginLeft: 4,
              fontWeight: 'bold',
              color: Colors.primaryColor,
            }}>
            {lang.l14}
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
  headingCNTR: {
    width: '100%',
    marginTop: '10%',
  },
  helperTxt: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: Colors.redColor,
    marginTop: 1,
    marginLeft: 5,
  },
  formCNTR: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  loginSwitchBtnCNTR: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  btnCNTR: {
    width: 150,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.blackColor,
  },
  selectedAccountBG: {
    backgroundColor: Colors.primaryColor,
  },
  btnTouchArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    height: '70%',
    marginHorizontal: 8,
    backgroundColor: Colors.whiteColor,
  },
  switcherName: {
    fontSize: 18,
    color: Colors.whiteColor,
  },
  createTxt: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CreateAccountScreen;
