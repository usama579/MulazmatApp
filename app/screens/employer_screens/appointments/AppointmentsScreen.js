import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../../constants/Colors';
import HeadingText from '../../../components/HeadingText';
import HeaderIcon from '../../../components/HeaderIcon';
import NormalText from '../../../components/NormalText';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';
import Card from '../../../components/Card';
import {Text} from 'react-native-paper';

const {width} = Dimensions.get('screen');

const AppointmentsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    setLoading(true);
    let user = auth().currentUser;
    // setUserUid(user?.uid)
    getAppointmentsList(user?.uid);
  }, [isFocused]);

  const getAppointmentsList = uid => {
    firestore()
      .collection('Appointments')
      .where('employerId', '==', uid)
      .get()
      .then(querySnapshot => {
        setAppointments([]);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(snapshot => {
            const job = snapshot.data();
            setAppointments(current => [...current, job]);
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
      <View style={{marginHorizontal: 20, flex: 1}}>
        <HeaderIcon isOpenDrawer={true} />
        <HeadingText>Appointments</HeadingText>
        <LoadingIndicator loading={loading} />
        <FlatList
          data={appointments}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => renderJobsItem(item)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

  function renderJobsItem(item) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
        <Card>
          {renderTitleAndValue('Title', item?.title)}
          {renderTitleAndValue('Type', item?.jobType)}
          {renderTitleAndValue('Category', item?.category)}
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

  function renderUserDetail(item) {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {}}
          style={styles.bookingInfoWrapStyle}>
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
              <NormalText
                style={{
                  fontSize: 14,
                  marginVertical: 10,
                }}>
                {item.work}
              </NormalText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
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

export default AppointmentsScreen;
