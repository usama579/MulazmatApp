import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Paddings from '../../constants/Paddings';
import Colors from '../../constants/Colors';
import NormalText from '../../components/NormalText';

import LoadingIndicator from '../../components/LoadingIndicator';

import '../../constants/GlobalHelperFunctions';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import routes from '../../navigation/routes';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectJobType from '../../components/SelectJobType';
import MyButton from '../../components/MyButton';
import firestore from '@react-native-firebase/firestore';
import HeadingText from '../../components/HeadingText';
import auth from '@react-native-firebase/auth';
import SuccessDialog from '../../components/SuccessDialog';
import ErrorDialog from '../../components/ErrorDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Searchbar, TextInput} from 'react-native-paper';
import HeaderIcon from '../../components/HeaderIcon';
import SmallText from '../../components/SmallText';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from "react-native-date-picker";
import {getUserInfo} from "../../firebase/authMethods"

const {width} = Dimensions.get('screen');

const db = firestore()
const chatsRef = db.collection('Chats')

const HomeScreen = props => {
  //States
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateCNTRNbr, setDateCNTRNbr] = useState(1);

  const [jobbers, setJobbers] = useState([]);
  const [jobType, setJobType] = useState('');
  const [selectedItem, setSelectedItem] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [searchArray, setSearchArray] = useState([]);
  const [userInfo,setUserInfo] = useState([])
  
  const DateContainerList = [
    {
      id: 1,
      title: 'Start Date',
      date: startDate,
    },
    {
      id: 2,
      title: 'End Date',
      date: endDate,
    },
  ];

  const onChangeSearch = query => setSearchQuery(query);

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  // ref
  const bottomSheetRef = useRef(null);
  const handleOpenPress = () => bottomSheetRef.current.expand();
  const handleClosePress = () => bottomSheetRef.current.close();

  // variables
  const snapPoints = useMemo(() => ['50%', '70%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    AsyncStorage.getItem('isEmployer')
      .then(user => {
        if (JSON.parse(user)) getAllJobberList();
        fetchUserinfo()
      })
      .catch(e => console.log(e));
  }, [isFocused]);

  useEffect(() => {
    if (searchQuery !== '') {
      const result = jobbers.filter(jobbers =>
        jobbers.name.includes(searchQuery),
      );
      setSearchArray(result);
    }
  }, [searchQuery]);

  const fetchUserinfo=async()=>{
    await getUserInfo().then((response)=>{
        setUserInfo(response)
    })
  }

  const onDateChange = selectedDate => {
    dateCNTRNbr === 1 ? setStartDate(selectedDate) : setEndDate(selectedDate);
  };

  const formatStartAndEndDate = (date, id) => {
    if (id === 1) {
      return date !== ''
        ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        : 'DD/MM/YYYY';
    } else {
      return date !== ''
        ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        : 'DD/MM/YYYY';
    }
  };

  const getAllJobberList = () => {
    setLoading(true);
    firestore()
      .collection('Users')
      .where('isEmployer', '==', false)
      .get()
      .then(querySnapshot => {
        setJobbers([]);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(snapshot => {
            const job = snapshot.data();
            setJobbers(current => [...current, job]);
          });
        }
        setLoading(false);
      })
      .catch(e => {
        console.error({e});
        setLoading(false);
      });
  };

  const checkIfAlreadyRequested = () => {
    setLoading(true);
    let user = auth().currentUser;
    firestore()
      .collection('AppliedJobbers')
      .where('employerId', '==', user?.uid)
      .where('jobberId', '==', selectedItem?.uid)
      .get()
      .then(doc => {
        if (doc.empty) {
          applyForHireJobber();
        } else {
          setLoading(false);
          alert('You Already Send Request to this Jobber');
        }
      })
      .catch(e => {
        setLoading(false);
        setErrorDialogShow(true);
      });
  };

  //send request to jobber for job //as job purposely
  const applyForHireJobber = () => {
    setLoading(true);
    let user = auth().currentUser;

    let body =
      jobType === 'Regular'
        ? {
            jobberId: selectedItem.uid,
            employerId: user?.uid,
            jobType: jobType,
            status: 'pending',
          }
        : {
            jobberId: selectedItem.uid,
            employerId: user?.uid,
            jobType: jobType,
            startDate: startDate,
            endDate: endDate,
            status: 'pending',
          };

    firestore()
      .collection('AppliedJobbers')
      .add(body)
      .then(docRef => {
        setLoading(false);
        setSuccessDialogShow(true);
      })
      .catch(e => {
        setLoading(false);
        setErrorDialogShow(true);
      });
  };

  const _checkJobPostValidation = () => {
    props.navigation.navigate(routes.JOB_POST_SCREEN, {
      isComingForEdit: false,
    });
  };

  const goToChat = async (secondUser) => {
    const roomName = (userInfo.uid<secondUser.uid ? userInfo.uid+'_'+secondUser.uid : secondUser.uid+'_'+userInfo.uid);
    var docRef = chatsRef.doc(roomName);

    await docRef.get().then((doc) => {
      if (doc.exists) {
        props.navigation.navigate(routes.CHAT_BOX_SCREEN,{
          threadId: roomName,
          userInfo:userInfo,
          secondUser:secondUser
          });
      } else {
        chatsRef.doc(roomName).set({
          receiverName:secondUser.name,
          senderId: userInfo.uid,
          receiverId: secondUser.uid,
             latestMessage: {
              //  text: ``,
               createdAt: new Date().getTime()
             }
           })
           .then((docRef) => {
            chatsRef.doc(roomName).collection('Messages').add({
              // text: ``,
              // createdAt: new Date().getTime(),
            },
            );
            props.navigation.navigate(routes.CHAT_BOX_SCREEN,{
            threadId: roomName,
            userInfo:userInfo,
            secondUser:secondUser
            });
          });
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <View style={styles.screen}>
        <LoadingIndicator loading={loading} />
        <SuccessDialog
          visibility={successDialogShow}
          onPress={() => {
            setSuccessDialogShow(false);
            handleClosePress();
          }}
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
            marginVertical: 10,
          }}>
          Service Provider's
        </HeadingText>

        <FlatList
          data={searchQuery !== '' ? searchArray : jobbers}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => renderItem(item)}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.floatBtn}>
          <TouchableCmp onPress={_checkJobPostValidation}>
            <Ionicons name="add" color={Colors.whiteColor} size={40} />
          </TouchableCmp>
        </View>
        {bookJobber()}
      </View>
    </SafeAreaView>
  );

  function bookJobber() {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{backgroundColor: Colors.whiteColor}}
        style={{zIndex: 1}}>
        <View style={{marginHorizontal: 20}}>
          <SelectJobType
            uncheckedColor={Colors.blackColor}
            color={Colors.whiteColor}
            getType={result => setJobType(result)}
          />
          {jobType === 'Time Duration' && <>
          <View style={styles.dateMainCNTR}>{_renderModalDateCNTR()}</View>
            <View
            style={{
            marginTop: 10,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.whiteColor,
            borderRadius: 8,
          }}>
            <DatePicker
            date={
            Platform.OS === 'android'
            ? new Date(Date.now())
            : dateCNTRNbr === 1
            ? startDate
            : endDate
          }
            mode="date"
            locale="en"
            onDateChange={onDateChange}
            />
            </View>
          </>
          }
          <MyButton title={'Book Now'} onPress={checkIfAlreadyRequested} />
        </View>
      </BottomSheet>
    );
  }

  function renderItem(item) {
    return (
      <View style={{width: '100%'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            handleOpenPress();
            setSelectedItem(item);
          }}
          style={styles.bookingInfoWrapStyle}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: item.profileImg}}
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
                {item.skill}
              </NormalText>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={styles.bookingDoneIconWrapStyle}>
              <MaterialIcons
                name="message"
                size={24}
                onPress={()=>goToChat(item)}
                color={Colors.primaryColor}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function startDateTextField() {
    return (
      <TextInput
        label="Start Date"
        mode="outlined"
        value={startDate}
        onChangeText={text => setStartDate(text)}
        style={{...styles.textFieldStyle, width: '48%'}}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }

  function endDateTextField() {
    return (
      <TextInput
        label="End Date"
        mode="outlined"
        value={endDate}
        onChangeText={text => setEndDate(text)}
        style={{...styles.textFieldStyle, width: '48%'}}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }

  function _renderModalDateCNTR() {
    return DateContainerList.map(e => (
      <View key={e.id} style={styles.dateCNTR}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            if (e.id === 1) {
              setDateCNTRNbr(e.id);
            } else {
              setDateCNTRNbr(e.id);
            }
          }}>
          <SmallText
            style={{
              color:
                dateCNTRNbr === e.id
                  ? Colors.primaryColor
                  : Colors.secondaryColor,
            }}>
            {e.title}
          </SmallText>
          <NormalText
            style={{
              color:
                dateCNTRNbr === e.id
                  ? Colors.primaryColor
                  : Colors.secondaryColor,
              fontSize: 25,
              flex: 1,
              textAlignVertical: 'center',
            }}>
            {formatStartAndEndDate(e.date, e.id)}
          </NormalText>
          <View
            style={{
              height: 5,
              width: '100%',
              borderRadius: 2.5,
              backgroundColor:
                dateCNTRNbr === e.id
                  ? Colors.primaryColor
                  : Colors.secondaryColor,
            }}
          />
        </TouchableOpacity>
      </View>
    ));
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
  bookingDoneIconWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.secondaryColor,
    borderWidth: 1.0,
    alignSelf: 'flex-end',
  },
  screen: {
    flex: 1,
    paddingHorizontal: Paddings.normalPadding,
    paddingBottom: Paddings.normalPadding,
  },
  floatBtn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.primaryColor,
    position: 'absolute',
    bottom: 50,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalDateCard: {
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    borderRadius: 4,
    padding: 5,
    marginTop: 10,
  },
  modalDateCNTR: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateMainCNTR: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateCNTR: {
    height: 70,
    width: '48%',
    backgroundColor: Colors.whiteColor,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
