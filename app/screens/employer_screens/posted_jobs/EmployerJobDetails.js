import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Colors from '../../../constants/Colors';
import NormalText from '../../../components/NormalText';

import LoadingIndicator from '../../../components/LoadingIndicator';

import '../../../constants/GlobalHelperFunctions';
import MyButton from '../../../components/MyButton';
import HeaderIcon from '../../../components/HeaderIcon';
import HeadingText from '../../../components/HeadingText';
import firestore from '@react-native-firebase/firestore';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import {Text} from 'react-native-paper';
import Card from '../../../components/Card';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import routes from '../../../navigation/routes';
import {useIsFocused} from '@react-navigation/native';

const JobDetailScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const jobDetailObj = route.params.item;
  const userUid = route.params.userUid;
  //States
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [applierList, setApplierList] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserRequest(jobDetailObj.uid);
  }, [isFocused]);

  //get users ids who applied
  const getUserRequest = () => {
    setLoading(true);
    firestore()
      .collection('AppliedJobs')
      .where('jobId', '==', jobDetailObj.id)
      .where('employerId', '==', userUid)
      .get()
      .then(querySnapshot => {
        let userIdsList = [];
        querySnapshot.forEach(snapshot => {
          let {jobberId} = snapshot.data();
          userIdsList = [...userIdsList, jobberId];
        });

        getUserWithIds(userIdsList);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  //get all those user data who applied for this job
  const getUserWithIds = userIdsList => {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        let userList = [];
        setApplierList([]);
        querySnapshot.forEach(snapshot => {
          let user = snapshot.data();
          userIdsList.forEach(userId => {
            if (user?.uid === userId) {
              userList.push(user);
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

  //start job with the jobber
  //and set job status to close
  const startJobs = jobberId => {
    setLoading(true);
    firestore()
      .collection('Jobs')
      .doc(jobDetailObj.docId)
      .update({
        status: 'close',
        startWithJobber: jobberId,
      })
      .then(() => {
        addJobToAppointmentsTable(jobberId);

        // getDocIdoOfRequest(jobberId);//this function is for update the status of jobber request
      })
      .catch(e => {
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  const addJobToAppointmentsTable = jobberId => {
    firestore()
      .collection('Appointments')
      .add({
        ...jobDetailObj,
        status: 'close',
        startWithJobber: jobberId,
      })
      .then(() => {
        setLoading(false);
        setSuccessDialogShow(true);
      })
      .catch(e => {
        console.log('addJobToAppointmentsTable ', e);
        setLoading(false);
        setErrorDialogShow(true);
      });
  };

  //get doc id fo request from the Applied job table to update the status of request pending to accepted
  const getDocIdoOfRequest = jobberId => {
    firestore()
      .collection('AppliedJobs')
      .where('employerId', '==', jobDetailObj.employerId)
      .where('jobId', '==', jobDetailObj.id)
      .where('jobberId', '==', jobberId)
      .get()
      .then(querySnapshot => {
        let docId = '';
        querySnapshot.forEach(snapshot => {
          docId = snapshot.id;
        });

        updateRequestStatusInAppliedJobTable(docId);
      })
      .catch(e => {
        console.log('getDocIdoOfRequest ', e);
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  //change also status of jobber request that employer accepted his request or rejected
  const updateRequestStatusInAppliedJobTable = docId => {
    firestore()
      .collection('AppliedJobs')
      .doc(docId)
      .update({
        status: 'accepted',
      })
      .then(() => {
        setLoading(false);
        setSuccessDialogShow(true);
      })
      .catch(e => {
        console.log('updateRequestStatusInAppliedJobTable ', e);
        setErrorDialogShow(true);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={styles.screen}>
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
        <LoadingIndicator loading={loading} />
        <HeaderIcon isOpenDrawer={false} />
        <HeadingText
          style={{
            marginTio: 10,
          }}>
          Jobs Detail
        </HeadingText>
        {renderJobsItem()}
        <FlatList
          data={applierList}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => renderJobberItem(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function renderJobsItem() {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <Card style={{paddingVertical: 10}}>
          {renderTitleAndValue('Title', jobDetailObj?.title)}
          {renderTitleAndValue('Type', jobDetailObj?.jobType)}
          {renderTitleAndValue('Category', jobDetailObj?.category)}
          {renderTitleAndValue('Description', jobDetailObj?.description)}
          {jobDetailObj.jobType === 'Time Duration' && (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: 5,
                justifyContent: 'space-between',
              }}>
              {renderTitleAndValue('Start Date', jobDetailObj?.startDate)}
              {renderTitleAndValue('End Date', jobDetailObj?.endDate)}
            </View>
          )}
        </Card>
      </TouchableWithoutFeedback>
    );
  }

  function renderTitleAndValue(title, value) {
    return (
      <View style={{marginTop: 10}}>
        <Text style={{color: Colors.grayColor, marginBottom: 4}}>{title}</Text>
        <NormalText style={{color: Colors.primaryColor}}>{value}</NormalText>
      </View>
    );
  }

  //who applied for this job
  function renderJobberItem(item) {
    return (
      <Card style={{width: '100%', marginVertical: 10}}>
        <View key={`${item.id}`}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate(routes.JOBBER_PROFILE_DETAILS_SCREEN, {item})
            }>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri: item.profileImg !== '' ? item.profileImg : undefined,
                }}
                style={{
                  width: 70.0,
                  height: 70.0,
                  borderRadius: 10,
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
                    marginTop: 2,
                  }}>
                  {item.email}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 5,
                  }}>
                  Skill : {item.skill}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <MyButton
          style={{marginVertical: 0, marginTop: 10, height: 35, width: '95%'}}
          title={'Accept'}
          onPress={() => startJobs(item.uid)}
        />
      </Card>
    );
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default JobDetailScreen;
