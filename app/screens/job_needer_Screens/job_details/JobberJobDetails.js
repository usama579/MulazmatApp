import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
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
import auth from '@react-native-firebase/auth';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const item = route.params.item;
  const userUid = route.params.userUid;
  //States
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('Email');
  const [phoneNo, setPhoneNo] = useState('Phone Number');
  const [profileImg, setProfileImg] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserData(item.employerId);

    return (()=>{
      setLoading(false)
    })
  }, [isFocused]);

  const getUserData = uid => {
    setLoading(true);
    firestore()
      .collection('Users')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(snapshot => {
          let {name, email, phoneNo, profileImg} = snapshot.data();

          setName(name);
          setEmail(email);
          setPhoneNo(phoneNo);
          setProfileImg(profileImg);
        });
        setLoading(false);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  const checkIfAlreadyApplied = (jobId) => {
    setLoading(true);
    firestore()
      .collection('AppliedJobs')
      .where('jobberId', '==', userUid)
      .where('jobId', '==', jobId)
      .where('employerId', '==', item.employerId)
      .get()
      .then(doc => {
        if (doc.empty) {
          applyForJob(jobId, item.employerId);
        } else {
          setLoading(false);
          alert('You Already Applied On this Job');
        }
      })
      .catch(e => {
        setLoading(false);
        setErrorDialogShow(true);
      });
  };

  const applyForJob = (jobId, employerId) => {
    setLoading(true);
    firestore()
      .collection('AppliedJobs')
      .add({
        jobberId: userUid,
        jobId: jobId,
        employerId: employerId,
        status: "pending"
      })
      .then(() => {
        setLoading(false);
        setSuccessDialogShow(true);
      })
      .catch(e => {
        setLoading(false);
        setErrorDialogShow(true);
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
        {renderEmployerDetails()}
        {renderJobsItem()}
      </View>
    </SafeAreaView>
  );

  function renderEmployerDetails() {
    return (
      <Card style={{width: '100%', marginVertical: 20}}>
        <View key={`${item.id}`}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: profileImg !== '' ? profileImg : undefined}}
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
                  {name}
                </NormalText>
                <Text
                  style={{
                    fontSize: 14,
                    marginVertical: 3,
                  }}>
                  {email}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {phoneNo}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  function renderJobsItem() {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <Card>
          {renderTitleAndValue('Title', item?.title)}
          {renderTitleAndValue('Type', item?.jobType)}
          {renderTitleAndValue('Category', item?.category)}

          {renderTitleAndValue('Description', item?.description)}

          <MyButton
            style={{marginVertical: 0, marginTop: 10, height: 35, width: '95%'}}
            title={'Apply'}
            onPress={() => checkIfAlreadyApplied(item.id)}
          />
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
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default HomeScreen;
