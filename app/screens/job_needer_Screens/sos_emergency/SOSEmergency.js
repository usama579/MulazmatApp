import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {TextInput} from 'react-native-paper';
import Colors from '../../../constants/Colors';

import HeaderIcon from '../../../components/HeaderIcon';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';
import firestore from '@react-native-firebase/firestore';
import ErrorDialog from '../../../components/ErrorDialog';
import SuccessDialog from '../../../components/SuccessDialog';
import HeadingText from '../../../components/HeadingText';
import {useIsFocused} from '@react-navigation/native';

const SOSEmergencyScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [docExits, setDocExits] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const [userUid, setUserUid] = useState('UserUID');

  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    setUserUid(user?.uid);
    getUserData(user?.uid);
  }, [isFocused]);

  const getUserData = uid => {
    setLoading(true);
    firestore()
      .collection('SOSEmergencyContact')
      .doc(uid)
      .get()
      .then(querySnapshot => {
        setDocExits(!querySnapshot.exists);

        let {name, email, phoneNo} = querySnapshot.data();
        setName(name);
        setEmail(email);
        setPhoneNo(phoneNo);

        setLoading(false);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const addDataToFireStore = () => {
    setLoading(true);
    firestore()
      .collection('SOSEmergencyContact')
      .doc(userUid)
      .set({
        name: name,
        email: email,
        phoneNo: phoneNo,
      })
      .then(() => {
        setSuccessDialogShow(true);
        setLoading(false);
      })
      .catch(e => {
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  const updateDataToFireStore = () => {
    setLoading(true);
    firestore()
      .collection('SOSEmergencyContact')
      .doc(userUid)
      .update({
        uid: userUid,
        name: name,
        email: email,
        phoneNo: phoneNo,
      })
      .then(() => {
        setSuccessDialogShow(true);
        setLoading(false);
      })
      .catch(e => {
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={{flex: 1, marginHorizontal: 20}}>
        <LoadingIndicator loading={loading} />
        <SuccessDialog
          visibility={successDialogShow}
          onPress={() => {
            setSuccessDialogShow(false);
          }}
        />
        <ErrorDialog
          visibility={errorDialogShow}
          onPress={() => setErrorDialogShow(false)}
        />
        <HeaderIcon isOpenDrawer={true} />
        <HeadingText>Emergency Contact</HeadingText>
        <ScrollView showsVerticalScrollIndicator={false}>
          {nameTextField()}
          {emailTextField()}
          {phoneNoTextField()}
          {saveButton()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (!docExits) {
            updateDataToFireStore();
          } else {
            addDataToFireStore();
          }
        }}
        style={styles.saveButtonStyle}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: Colors.whiteColor,
          }}>
          Save
        </Text>
      </TouchableOpacity>
    );
  }

  function phoneNoTextField() {
    return (
      <TextInput
        label="Phone Number"
        mode="outlined"
        keyboardType="numeric"
        value={phoneNo}
        onChangeText={text => setPhoneNo(text)}
        style={styles.textFieldStyle}
        selectionColor={Colors.blackColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }

  function emailTextField() {
    return (
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.textFieldStyle}
        selectionColor={Colors.blackColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.textFieldStyle}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }
};

const styles = StyleSheet.create({
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 10 - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 10 + 5.0,
  },
  textFieldStyle: {
    fontSize: 14,
    color: Colors.blackColor,
    backgroundColor: Colors.secondaryColor,
    marginVertical: 10 - 3.0,
    height: 48.0,
  },
});

export default SOSEmergencyScreen;
