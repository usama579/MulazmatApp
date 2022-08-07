import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
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
import {Searchbar, Text} from 'react-native-paper';
import Card from '../../../components/Card';
import auth from '@react-native-firebase/auth';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import routes from '../../../navigation/routes';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  //States
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userUid, setUserUid] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchArray, setSearchArray] = useState([]);

  const onChangeSearch = query => setSearchQuery(query);
  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    setUserUid(user?.uid);
if(user  !== null)
  getJobs();
  }, [isFocused]);

  useEffect(() => {
    if (searchQuery !== '') {
      const result = jobs.filter(jobbers =>
        jobbers.title.includes(searchQuery),
      );
      setSearchArray(result);
    }
  }, [searchQuery]);

  const applyForJob = (jobId, employerId) => {
    setLoading(true);
    firestore()
      .collection('AppliedJobs')
      .add({
        jobberId: userUid,
        jobId: jobId,
        employerId:employerId,
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

  const checkIfAlreadyApplied = (jobId, employerId) => {
    setLoading(true);
    firestore()
      .collection('AppliedJobs')
      .where('jobberId', '==', userUid)
      .where('jobId', '==', jobId)
      .where('employerId', '==', employerId)
      .get()
      .then(doc => {
        if (doc.empty) {
          applyForJob(jobId, employerId);
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

  const getJobs = () => {
    setLoading(true);
    firestore()
      .collection('Jobs')
      .where("status", "==", "open")
      .get()
      .then(querySnapshot => {
        const allJobs = querySnapshot.docs.map(docSnap => {
          return docSnap.data();
        });
        setJobs(allJobs);
        setLoading(false);
      })
      .catch(e => {
        console.log({e});
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={styles.screen}>
        <LoadingIndicator loading={loading} />

        <SuccessDialog
          visibility={successDialogShow}
          onPress={() => setSuccessDialogShow(false)}
        />

        <ErrorDialog
          visibility={errorDialogShow}
          onPress={() => setErrorDialogShow(false)}
        />
        <HeaderIcon isOpenDrawer={true} />
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <HeadingText
          style={{
            marginTop: 16,
          }}>
          Jobs's
        </HeadingText>
        <NormalText
          style={{
            marginTop: 5,
            marginBottom: 10,
          }}>
          Get Your Job Now.
        </NormalText>

        <FlatList
          data={searchQuery !== '' ? searchArray : jobs}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => renderJobsItem(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function renderJobsItem(item) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate(routes.JOBBER_JOB_DETAILS_SCREEN, {item, userUid})
        }>
        <Card>
          {renderTitleAndValue('Title', item?.title)}
          {renderTitleAndValue('Type', item?.jobType)}
          {renderTitleAndValue('Category', item?.category)}

          <MyButton
            style={{marginVertical: 0, marginTop: 10, height: 35, width: '95%'}}
            title={'Apply'}
            onPress={() => checkIfAlreadyApplied(item.id, item.employerId)}
          />
        </Card>
      </TouchableOpacity>
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
