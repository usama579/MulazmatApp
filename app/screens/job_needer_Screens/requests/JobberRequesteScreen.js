import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import Colors from '../../../constants/Colors';
import HeaderIcon from '../../../components/HeaderIcon';
import NormalText from '../../../components/NormalText';
import {TabBar, TabView} from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import Card from '../../../components/Card';
import TwoButtons from '../../../components/TwoButtons';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const PendingTab = ({
  list,
  setLoading,
  setSuccessDialogShow,
  setErrorDialogShow,
}) => {
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    let pendingRequest = [];
    list.forEach(request => {
      if (request.status === 'pending') {
        pendingRequest = [...pendingRequest, request];
      }
    });
    setPendingList(pendingRequest);
  }, [list]);

  const findObjectIdNode = (status, jobberId, employerId) => {
    setLoading(true);
    firestore()
      .collection('AppliedJobbers')
      .where('jobberId', '==', jobberId)
      .where('employerId', '==', employerId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
          // let data = snapshot.data();
          updateRequest(snapshot.id, status, employerId);
        });
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const updateRequest = (docId, status, employerId) => {
    firestore()
      .collection('AppliedJobbers')
      .doc(docId)
      .update({
        status: status,
      })
      .then(() => {
        removeClickedItemFromList(employerId);
      })
      .catch(e => {
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  const removeClickedItemFromList = employerId => {
    let pendingRequest = [];
    list.forEach(request => {
      if (request.status !== 'pending' && request.employerId !== employerId) {
        pendingRequest = [...pendingRequest, request];
      }
    });
    setPendingList(pendingRequest);
    setSuccessDialogShow(true);
    setLoading(false);
  };

  return (
    <View style={{flex: 1, marginHorizontal: 10}}>
      <FlatList
        data={pendingList}
        keyExtractor={(item, index) => index}
        renderItem={({item}) =>
          renderEmployerItem(
            item,
            'pending',
            (jobberId, employerId) => {
              findObjectIdNode('decline', jobberId, employerId);
            },
            (jobberId, employerId) => {
              findObjectIdNode('active', jobberId, employerId);
            },
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const DeclineTab = ({list}) => {
  const [declineList, setDeclineList] = useState([]);

  useEffect(() => {
    let activeRequest = [];
    list.forEach(request => {
      if (request.status === 'decline') {
        activeRequest = [...activeRequest, request];
      }
    });
    setDeclineList(activeRequest);
  }, [list]);

  return (
    <View style={{flex: 1, marginHorizontal: 10}}>
      <FlatList
        data={declineList}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => renderEmployerItem(item, 'decline', null, null)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

function renderEmployerItem(item, tab, onPressDeclineBtn, onPressAccept) {
  return (
    <Card style={{width: '100%', marginVertical: 20}}>
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{
                uri: item.profileImg !== '' ? item.profileImg : undefined,
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
                {item.name}
              </NormalText>
              <Text
                style={{
                  fontSize: 14,
                  marginVertical: 3,
                }}>
                {item.email}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                }}>
                {item.phoneNo}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
      {tab === 'pending' && (
        <>
          <TwoButtons
            leftBtnTitle={'Decline'}
            rightBtnTitle={'Accept'}
            onPressLeftBtn={() =>
              onPressDeclineBtn(item.jobberId, item.employerId)
            }
            onPressRightBtn={() =>
              onPressAccept(item.jobberId, item.employerId)
            }
          />
        </>
      )}
    </Card>
  );
}

const RequestScreen = ({navigation}) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'pending', title: 'Pending'},
    {key: 'decline', title: 'Declined'},
  ]);

  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [applierList, setApplierList] = useState([]);

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'pending':
        return (
          <PendingTab
            list={applierList}
            setLoading={setLoading}
            setSuccessDialogShow={setSuccessDialogShow}
            setErrorDialogShow={setErrorDialogShow}
          />
        );
      case 'decline':
        return <DeclineTab list={applierList} />;
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    if (user) {
      getEmployerIdsWhoRequest(user?.uid);
    }
  }, [isFocused]);

  //get all Employer and there offer job (regular or time...) to this jobber
  const getEmployerIdsWhoRequest = currentJobberId => {
    setLoading(true);
    firestore()
      .collection('AppliedJobbers')
      .where('jobberId', '==', currentJobberId)
      .get()
      .then(querySnapshot => {
        let employerIdsList = [];

        querySnapshot.forEach(snapshot => {
          let request = snapshot.data();

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
    console.log({userIdsList});
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

      <View style={{flex: 1}}>
        <View style={{marginHorizontal: 10}}>
          <HeaderIcon isOpenDrawer={true} />
        </View>

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: Colors.whiteColor,
                padding: 1.5,
                marginBottom: -2,
              }}
              style={{backgroundColor: Colors.primaryColor}}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default RequestScreen;
