import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Dialog from 'react-native-dialog';
import Colors from '../../../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import routes from '../../../navigation/routes';
import HeaderIcon from '../../../components/HeaderIcon';
import firestore from '@react-native-firebase/firestore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const JobberProfileScreen = ({navigation, route}) => {
  const item = route.params?.item;
  const [isLogout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('Email');
  const [phoneNo, setPhoneNo] = useState('Phone Number');
  const [skill, setSkill] = useState('');
  const [profileImg, setProfileImg] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    if (item === undefined) {
      let user = auth().currentUser;

      if (user) {
        // User is signed in.
        getUserData(user?.uid);
      }
    } else {
      setUserData();
    }
  }, [isFocused]);

  const getUserData = uid => {
    setLoading(true);
    firestore()
      .collection('Users')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
          let {name, email, phoneNo, profileImg, skill} = snapshot.data();

          setName(name);
          setEmail(email);
          setPhoneNo(phoneNo);
          setProfileImg(profileImg);
          setSkill(skill);
        });
        setLoading(false);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const setUserData = () => {
    setName(item.name);
    setEmail(item.email);
    setPhoneNo(item.phoneNo);
    setProfileImg(item.profileImg);
    setSkill(item.skill);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={{flex: 1, marginHorizontal: 20}}>
        <LoadingIndicator loading={loading} />
        <HeaderIcon isOpenDrawer={item === undefined} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10 * 7.0}}>
          {userInfo()}

          {title({title: 'ABOUT'})}

          {moreInfo({info: email})}
          {moreInfo({info: phoneNo})}
          {moreInfo({info: skill})}

          {/*{title({title: 'APP'})}*/}

          {/*<TouchableOpacity*/}
          {/*  activeOpacity={0.9}*/}
          {/*  onPress={() => navigation.push('Support')}>*/}
          {/*  {moreInfo({info: 'Support'})}*/}
          {/*</TouchableOpacity>*/}

          {item === undefined && logOutInfo()}
        </ScrollView>

        {logOutDialog()}
      </View>
    </SafeAreaView>
  );

  function logOutDialog() {
    return (
      <Dialog.Container
        visible={isLogout}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{margin: 0.0, padding: 0.0}}>
        <View
          style={{backgroundColor: Colors.whiteColor, alignItems: 'center'}}>
          <Text
            style={{
              ...{fontSize: 16, color: Colors.blackColor},
              paddingBottom: 10 - 5.0,
            }}>
            You sure want to logout?
          </Text>
          <View style={styles.logoutAndCancelButtonWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setLogout(false)}
              style={styles.cancelButtonStyle}>
              <Text style={{...{fontSize: 14, color: Colors.blackColor}}}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setLogout(false);
                navigation.replace(routes.LOGIN_SCREEN);
              }}
              style={styles.logOutButtonStyle}>
              <Text style={{...{fontSize: 14, color: Colors.whiteColor}}}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  function logOutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setLogout({isLogout: true})}
        style={styles.logoutInfoWrapStyle}>
        <MaterialCommunityIcons
          name="login-variant"
          size={24}
          color="#FF0000"
        />
        <Text
          style={{...{fontSize: 14, color: Colors.redColor}, marginLeft: 10}}>
          Logout
        </Text>
      </TouchableOpacity>
    );
  }

  function divider() {
    return (
      <View
        style={{
          backgroundColor: Colors.grayColor,
          height: 1.0,
          marginVertical: 10,
        }}
      />
    );
  }

  function title({title}) {
    return (
      <Text
        numberOfLines={1}
        style={{
          color: Colors.primaryColor,
          marginTop: 10,
          fontWeight: 'bold',
          marginBottom: 15.0,
        }}>
        {title}
      </Text>
    );
  }

  function moreInfo({info}) {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: width - 80}}>
            <Text
              numberOfLines={1}
              style={{...{fontSize: 14, color: Colors.blackColor}}}>
              {info}
            </Text>
          </View>
        </View>
        {divider()}
      </View>
    );
  }

  function userInfo() {
    return (
      <View style={styles.userInfoWrapStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: profileImg !== '' ? profileImg : undefined}}
            style={{
              height: 70.0,
              width: 70.0,
              borderRadius: 35.0,
              backgroundColor: Colors.primaryColor,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              color: Colors.blackColor,
              fontWeight: 'bold',
              width: width - 200,
              marginLeft: 10 * 2.0,
            }}>
            {name}
          </Text>
        </View>
        {item === undefined && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.push(routes.EDIT_JOBBER_PROFILE_SCREEN, {
                name,
                email,
                phoneNo,
                profileImg,
                skill,
              })
            }
            style={styles.editButtonStyle}>
            <MaterialIcons name="edit" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    height: 53.0,
    elevation: 3.0,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoWrapStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10 * 2.0,
  },
  editButtonStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
  },
  dialogWrapStyle: {
    borderRadius: 10,
    width: width - 40,
    paddingTop: 10 + 5.0,
    paddingBottom: 10 * 2.0,
  },
  cancelButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10 - 5.0,
  },
  logOutButtonStyle: {
    flex: 0.45,
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    paddingVertical: 10 - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 10 + 5.0,
  },
  logoutAndCancelButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 10 * 2.0,
    marginTop: 10 - 5.0,
  },
});

export default JobberProfileScreen;
