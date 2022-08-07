import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import Colors from '../../constants/Colors';
import HeaderIcon from '../../components/HeaderIcon';
import NormalText from '../../components/NormalText';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../../components/LoadingIndicator';
import SuccessDialog from '../../components/SuccessDialog';
import ErrorDialog from '../../components/ErrorDialog';
import Card from '../../components/Card';
import HeadingText from '../../components/HeadingText';

const {width} = Dimensions.get('screen');

const MyScheduleScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [applierList, setApplierList] = useState([]);

  useEffect(() => {
    let user = auth().currentUser;
    if (user) {
      getEmployerIdsWhoRequest(user?.uid);
    }
  }, []);

  const getEmployerIdsWhoRequest = currentJobberId => {
    setLoading(true);
    firestore()
      .collection('AppliedJobbers')
      .where('jobberId', '==', currentJobberId)
      .where('status', '==', 'active')
      .get()
      .then(querySnapshot => {
        let employerIdsList = [];

        querySnapshot.forEach(snapshot => {
          let request = snapshot.data();
          request = {...request, docId: snapshot.id};

          employerIdsList = [...employerIdsList, request];
        });
        getUserWithIds(employerIdsList);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const getUserWithIds = userIdsList => {
    firestore()
      .collection('Users')
      .where("isEmployer","==", true)
      .get()
      .then(querySnapshot => {
        let userList = [];
        setApplierList([]);
        querySnapshot.forEach(snapshot => {
          let employer = snapshot.data();
          userIdsList.forEach(user => {
            if (employer.uid === user.employerId) {
              userList.push({...employer, ...user});
            }
          });
        });
        setApplierList(userList);
        setLoading(false);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
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

      <View style={{flex: 1, marginHorizontal: 10}}>
        <HeaderIcon isOpenDrawer={true} />
        <HeadingText>My Schedule</HeadingText>

        <FlatList
          data={applierList}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => renderEmployerRequestDetailItem(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function renderEmployerRequestDetailItem(item) {
    return (
      <Card style={{width: '100%', marginVertical: 20}}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{
                uri: item?.profileImg !== '' ? item?.profileImg : undefined,
              }}
              style={{
                width: 60.0,
                height: 60.0,
                borderRadius: 10,
                backgroundColor: Colors.secondaryColor,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                marginLeft: 10,
                maxWidth: width / 2.0,
              }}>
              <NormalText
                style={{color: Colors.primaryColor, fontWeight: 'bold'}}>
                {item?.name}
              </NormalText>
              <Text
                style={{
                  fontSize: 14,
                  marginVertical: 3,
                }}>
                {item?.email}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {item?.phoneNo}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: Colors.secondaryColor,
            marginVertical: 10,
          }}
        />

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryColor,
          }}>
          Job Detail
        </Text>
        <View
          style={{
            alignSelf: 'flex-end',
            backgroundColor: Colors.primaryColor,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: Colors.whiteColor,
            }}>
            {item?.jobType}
          </Text>
        </View>
        {item.jobType === 'Time Duration' && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            {renderTitleAndValue('Start Date', item?.startDate)}
            {renderTitleAndValue('End Date', item?.endDate)}
          </View>
        )}
      </Card>
    );
  }

  function renderTitleAndValue(title, value) {
    return (
      <View style={{marginTop: 10}}>
        <Text style={{color: Colors.grayColor, marginBottom: 4}}>{title}</Text>
        <Text style={{color: Colors.primaryColor}}>{new Date(value?.seconds * 1000).toDateString()}</Text>
      </View>
    );
  }
};

export default MyScheduleScreen;
