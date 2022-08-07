import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Title, Drawer} from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import auth from '@react-native-firebase/auth';
import routes from './routes';
import firestore from '@react-native-firebase/firestore';

const CustomDrawer = props => {
  const [userName, setUserName] = useState('No Name');
  const [imageUrl, setImageUrl] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    if (user === null) props.navigation.replace(routes.SPLASH_SCREEN);
  }

  useEffect(() => {
    let user = auth().currentUser;

    if (user) {
      // User is signed in.
      setUserName(user?.displayName);
      // getUserData(user?.uid);

      const usersRef = firestore()
        .collection('Users')
        .where('uid', '==', user.uid);

      usersRef.onSnapshot(querySnap => {
        const data = querySnap.docs.map(docSnap => {
          const {profileImg, name} = docSnap.data();

            return { profileImg, name }
        });

        setImageUrl(data[0].profileImg);
        setUserName(data[0].name)
      });

    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const getUserData = uid => {
    firestore()
      .collection('Users')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
          const {profileImg} = snapshot.data();
          setImageUrl(profileImg);
        });
      })
      .catch(e => {
        console.log({e});
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            style={{backgroundColor: Colors.secondaryColor}}
            source={{
              uri: imageUrl !== '' ? imageUrl : undefined,
            }}
            size={100}
          />
          <Title style={styles.title}>
            {userName !== null ? global.capitalizeFirstLetter(userName) : ''}
          </Title>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}>
        <TouchableOpacity
          onPress={() => {
            auth()
              .signOut()
              .then(() => console.log('User signed out!'));
            AsyncStorage.clear();
          }}
          style={{paddingVertical: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={24} color={Colors.whiteColor} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                color: Colors.whiteColor,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    color: Colors.whiteColor,
  },
});

export default CustomDrawer;
