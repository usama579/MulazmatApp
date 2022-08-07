import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import Colors from '../../../constants/Colors';
import HeadingText from '../../../components/HeadingText';
import HeaderIcon from '../../../components/HeaderIcon';
import NormalText from '../../../components/NormalText';
import {Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import auth from '@react-native-firebase/auth';
import Card from '../../../components/Card';
import routes from '../../../navigation/routes';
import {useIsFocused} from '@react-navigation/native';

const PostedJobs = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userUid, setUserUid] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    let user = auth().currentUser;
    setUserUid(user?.uid);
    getJobsList(user?.uid);
  }, [isFocused]);

  const getJobsList = uid => {
    setLoading(true);
    firestore()
      .collection('Jobs')
      .where('employerId', '==', uid)
      .where('status', '==', 'open')
      .get()
      .then(querySnapshot => {
        setJobs([]);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(snapshot => {
            let job = snapshot.data();
            job = {
              ...job,
              docId: snapshot.id,
            };
            setJobs(current => [...current, job]);
          });
        }
        setLoading(false);
      })
      .catch(e => {
        console.error({e});
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={{flex: 1, marginHorizontal: 20}}>
        <LoadingIndicator loading={loading} />
        <HeaderIcon isOpenDrawer={true} />
        <HeadingText>Posted Jobs</HeadingText>
        <FlatList
          data={jobs}
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
          navigation.navigate(routes.EMPLOYER_JOB_DETAILS_SCREEN, {
            item,
            userUid,
          })
        }>
        <Card>
          {renderTitleAndValue('Title', item?.title)}
          {renderTitleAndValue('Type', item?.jobType)}
          {renderTitleAndValue('Category', item?.category)}

          {/*<MyButton style={{marginVertical:0, marginTop: 10, height:35, width: '95%'}} title={"Delete"}/>*/}
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
  card: {
    width: '100%',
    marginTop: 10,
    padding: 7,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default PostedJobs;
