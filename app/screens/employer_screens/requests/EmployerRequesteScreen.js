import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import Colors from '../../../constants/Colors';
import HeadingText from '../../../components/HeadingText';
import HeaderIcon from '../../../components/HeaderIcon';
import NormalText from '../../../components/NormalText';
const {width} = Dimensions.get('screen');
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import {useIsFocused} from '@react-navigation/native';

const PendingTab = ({
  list,
  setLoading,
  setSuccessDialogShow,
  setErrorDialogShow,
}) => {
  const [activeList, setActiveList] = useState([]);

  useEffect(() => {
    let activeRequest = [];
    list.forEach(request => {
      if (request.status === 'pending') {
        activeRequest = [...activeRequest, request];
      }
    });
    setActiveList(activeRequest);
  }, [list]);

  return (
    <View style={{flex: 1, margin: 10}}>
      <FlatList
        data={activeList}
        keyExtractor={(item, index) => index}
        renderItem={({item}) =>
          renderAppointmentsList(
            item,
            'pending',
            setLoading,
            setSuccessDialogShow,
            setErrorDialogShow,
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const DeclineTab = ({
  list,
  setLoading,
  setSuccessDialogShow,
  setErrorDialogShow,
}) => {
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
    <View style={{flex: 1, margin: 10}}>
      <FlatList
        data={declineList}
        keyExtractor={(item, index) => index}
        renderItem={({item}) =>
          renderAppointmentsList(
            item,
            'decline',
            setLoading,
            setSuccessDialogShow,
            setErrorDialogShow,
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

function renderAppointmentsList(item) {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {}}
        style={styles.bookingInfoWrapStyle}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: item.profileImg === '' ? undefined : item.profileImg}}
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
            <NormalText
              style={{
                fontSize: 14,
                marginVertical: 10,
              }}>
              {item.jobType}
            </NormalText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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

  const renderScene = ({route}) => {
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
        return (
          <DeclineTab
            list={applierList}
            setLoading={setLoading}
            setSuccessDialogShow={setSuccessDialogShow}
            setErrorDialogShow={setErrorDialogShow}
          />
        );
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    if (user) {
      getEmployerIdsWhoRequest(user?.uid);
    }
  }, [isFocused]);

  const getEmployerIdsWhoRequest = currentEmployerId => {
    setLoading(true);
    firestore()
      .collection('AppliedJobbers')
      .where('employerId', '==', currentEmployerId)
      .get()
      .then(querySnapshot => {
        let jobberIdsList = [];

        querySnapshot.forEach(snapshot => {
          let request = snapshot.data();

          jobberIdsList = [...jobberIdsList, request];
        });
        getUserWithIds(jobberIdsList);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const getUserWithIds = userIdsList => {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        let userList = [];
        setApplierList([]);
        querySnapshot.forEach(snapshot => {
          let jobber = snapshot.data();
          userIdsList.forEach(user => {
            if (jobber.uid === user.jobberId) {
              userList.push({...jobber, ...user});
            }
          });
        });

        console.log({userList});
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

const styles = StyleSheet.create({
  bookingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: '#d3d3d3',
    borderWidth: 1.0,
    marginBottom: 10,
  },
});

export default RequestScreen;
