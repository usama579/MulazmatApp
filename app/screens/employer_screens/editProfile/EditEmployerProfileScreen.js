import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {TextInput} from 'react-native-paper';
import Colors from '../../../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderIcon from '../../../components/HeaderIcon';
import BottomSheet from '@gorhom/bottom-sheet';

import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';
import firestore from '@react-native-firebase/firestore';
import ErrorDialog from '../../../components/ErrorDialog';
import SuccessDialog from '../../../components/SuccessDialog';
import routes from '../../../navigation/routes';
import {useIsFocused} from '@react-navigation/native';

const EditEmployerProfileScreen = ({navigation, route}) => {
  const item = route.params;
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [newImageSelected, setNewImageSelected] = useState(false);

  // ref
  const bottomSheetRef = useRef(null);
  const handleOpenPress = () => bottomSheetRef.current.expand();
  const handleClosePress = () => bottomSheetRef.current.close();

  const [userUid, setUserUid] = useState('UserUIDShouldbeHere');

  const reference = storage().ref(userUid);

  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    setUserUid(user?.uid);
    setCurrentDate();
  }, [isFocused]);

  const setCurrentDate = () => {
    setProfileImg(item?.profileImg);
    setName(item?.name);
    setEmail(item?.email);
    setPhoneNo(item?.phoneNo);
  };

  const uploadImageToFirebase = async () => {
    // path to existing file on filesystem
    // uploads file
    setLoading(true);
    try {
      await reference.putFile(profileImg);
      const url = await reference.getDownloadURL();
      setProfileImg(url);
      uploadOtherDataToFireStore(url);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const uploadOtherDataToFireStore = ImageUrl => {
    setLoading(true);
    let data = ImageUrl ===  null ? {
      name: name,
      email: email,
      phoneNo:  phoneNo === undefined ? " " : phoneNo,
    } : {
      profileImg: ImageUrl,
      name: name,
      email: email,
      phoneNo: phoneNo === undefined ? " " : phoneNo,
    }
    firestore()
      .collection('Users')
      .doc(userUid)
      .update(data)
      .then(() => {
        setSuccessDialogShow(true);
        setLoading(false);
      })
      .catch(e => {
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  const openGalleryAndSelectImage = () => {
    ImagePicker.openPicker({
      width: 80,
      height: 80,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      setProfileImg(image.path);
      setNewImageSelected(true)
    });
  };

  // variables
  const snapPoints = useMemo(() => ['20%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={{flex: 1, marginHorizontal: 20}}>
        <LoadingIndicator loading={loading} />
        <SuccessDialog
          visibility={successDialogShow}
          onPress={() => {
            setSuccessDialogShow(false);
            navigation.pop();
          }}
        />
        <ErrorDialog
          visibility={errorDialogShow}
          onPress={() => setErrorDialogShow(false)}
        />
        <HeaderIcon isOpenDrawer={false} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {changeProfilePhoto()}
          {nameTextField()}
          {emailTextField()}
          {phoneNoTextField()}
          {saveButton()}
        </ScrollView>
      </View>
      {changeProfileOptions()}
    </SafeAreaView>
  );

  function changeProfileOptions() {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{backgroundColor: Colors.primaryColor}}>
        <View>
          <TouchableOpacity activeOpacity={0.9} onPress={handleClosePress}>
            <Text
              style={{
                ...{fontSize: 16, color: Colors.blackColor},
                textAlign: 'center',
              }}>
              Choose Option
            </Text>
            <View style={styles.bottomSheetDividerStyle} />
            <View style={{flexDirection: 'row', marginHorizontal: 10 * 2.0}}>
              <MaterialIcons
                name="photo-camera"
                size={20}
                color={Colors.whiteColor}
              />
              <Text
                style={{
                  ...{fontSize: 14, color: Colors.whiteColor},
                  marginLeft: 10 - 5.0,
                }}>
                Camera
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginHorizontal: 10 * 2.0,
              }}>
              <MaterialIcons
                name="photo-album"
                size={19}
                color={Colors.whiteColor}
              />
              <Text
                style={{
                  ...{fontSize: 14, color: Colors.whiteColor},
                  marginLeft: 10 - 5.0,
                }}>
                Upload from gallery
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => newImageSelected ? uploadImageToFirebase() : uploadOtherDataToFireStore(null)}
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

  function changeProfilePhoto() {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 10 * 3.0,
          marginBottom: 10 + 5.0,
          alignItems: 'center',
        }}>
        <Image
          source={{uri: profileImg !== '' ? profileImg : undefined}}
          style={{
            height: 115.0,
            width: 115.0,
            borderRadius: 55.0,
            borderWidth: 3,
            borderColor: Colors.whiteColor,
            backgroundColor: Colors.primaryColor,
          }}
          resizeMode="cover"
        />
        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={handleOpenPress}
          onPress={openGalleryAndSelectImage}
          style={styles.changeInfoWrapStyle}>
          <MaterialIcons
            name="photo-camera"
            size={17}
            color={Colors.whiteColor}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              color: Colors.whiteColor,
            }}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10 * 2.0,
    elevation: 10.0,
  },
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 10 - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 10 + 5.0,
  },
  changeInfoWrapStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -10.0,
    backgroundColor: Colors.redColor,
    borderRadius: 10 * 2.0,
    paddingHorizontal: 10 + 6.0,
    paddingVertical: 10 - 7.0,
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
  textFieldStyle: {
    fontSize: 14,
    color: Colors.blackColor,
    backgroundColor: Colors.secondaryColor,
    marginVertical: 10 - 3.0,
    height: 48.0,
  },
  bottomSheetDividerStyle: {
    backgroundColor: Colors.secondaryColor,
    height: 1.0,
    marginVertical: 10,
  },
});

export default EditEmployerProfileScreen;
