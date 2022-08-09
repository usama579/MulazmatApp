import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {TextInput} from 'react-native-paper';
import Colors from '../../../constants/Colors';
import HeaderIcon from '../../../components/HeaderIcon';
import SelectCategoryDropDown from '../../../components/SelectCategoryDropDown';
import HeadingText from '../../../components/HeadingText';
import SelectJobType from '../../../components/SelectJobType';
import firestore from '@react-native-firebase/firestore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import SuccessDialog from '../../../components/SuccessDialog';
import ErrorDialog from '../../../components/ErrorDialog';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from "react-native-date-picker";
import SmallText from "../../../components/SmallText";
import NormalText from "../../../components/NormalText";
import LocationComponent from '../../../components/LocationComponent';
import routes from '../../../navigation/routes';

const PostJobScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [successDialogShow, setSuccessDialogShow] = useState(false);
  const [errorDialogShow, setErrorDialogShow] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [userUid, setUserUid] = useState('UserUIDShouldbeHere');
  const [totalJobs, setTotalJobs] = useState([]);
  const [location, setLocation] = useState("Pick Location")
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateCNTRNbr, setDateCNTRNbr] = useState(1);

  const isFocused = useIsFocused();

  useEffect(() => {
    let user = auth().currentUser;
    setUserUid(user?.uid);
    getTotalJobs();
    return clearAllState();
  }, [isFocused]);

  const clearAllState = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setJobType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation("Pick Location")
  };

  const getTotalJobs = () => {
    setLoading(true);
    firestore()
      .collection('Jobs')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(snapshot => {
            const job = snapshot.data();
            setTotalJobs(current => [...current, job]);
          });
        } else {
          console.log('Jobs does not exists!');
        }
        setLoading(false);
      })
      .catch(e => {
        console.error({e});
        setLoading(false);
      });
  };

  const uploadJobToFireStore = () => {
    if (title == "") {
      alert ("Kindly enter the Title")
    } else if (description == "") {
      alert ("Kindly enter the Description")
    } else if (selectedCategory == "") {
      alert ("Kindly select the Category")
    } else if (jobType == "") {
      alert ("Kindly Select the Job Type")
    } else {
      setLoading(true);
    firestore()
      .collection('Jobs')
      .add({
        id: totalJobs.length + 1,
        title: title,
        description: description,
        jobType: jobType,
        category: selectedCategory,
        startDate: startDate,
        endDate: endDate,
        employerId: userUid,
        status: 'open',
      })
      .then(() => {
        setLoading(false);
        setSuccessDialogShow(true);
        clearAllState();
      })
      .catch(e => {
        setLoading(false);
        setErrorDialogShow(true);
      });
    }
  };

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.secondaryColor}}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <LoadingIndicator loading={loading} />
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

        <HeaderIcon isOpenDrawer={false} />
        <HeadingText>Post A Job</HeadingText>
        {nameTextField()}

        {descriptionTextField()}
        <SelectCategoryDropDown
          setSelectedValue={setSelectedCategory}
          selectedValue={selectedCategory}
        />
        <TouchableOpacity
        style={{ 
          paddingVertical: 15,
          backgroundColor: Colors.secondaryColor,
          borderWidth:1,
          borderColor: Colors.blackColor,
          borderRadius: 8,
          marginVertical: 10 - 3.0,
        }}
        onPress={() => navigation.navigate(routes.PICK_LOCATION)}
      >
        <Text style={{ marginLeft:10, fontSize: 14, color:Colors.primaryColor }}>
          {location}
        </Text>
      </TouchableOpacity>
        <LocationComponent/>
        <SelectJobType getType={result => setJobType(result)} />
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
              locale="en"
              mode="date"
              onDateChange={onDateChange}
            />
          </View>
        </>
        }
        {saveButton()}
      </View>
      </ScrollView>
    </SafeAreaView>
  );

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

  function saveButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={uploadJobToFireStore}
        style={styles.saveButtonStyle}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: Colors.whiteColor,
          }}>
          Save
        </Text>
      </TouchableOpacity>
    );
  }

  function descriptionTextField() {
    return (
      <View style={{width: '100%', height: 150}}>
        <TextInput
          label="Description"
          mode="outlined"
          multiline={true}
          value={description}
          numberOfLines={6}
          onChangeText={text => setDescription(text)}
          style={{...styles.textFieldStyle, flex: 1, textAlignVertical: 'top'}}
          selectionColor={Colors.blackColor}
          theme={{
            colors: {
              primary: Colors.primaryColor,
              underlineColor: 'transparent',
            },
          }}
        />
      </View>
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.textFieldStyle}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: {primary: Colors.primaryColor, underlineColor: 'transparent'},
        }}
      />
    );
  }

};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10 * 2.0,
    elevation: 10.0,
  },
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 10 - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 20,
  },
  changeInfoWrapStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -10.0,
    backgroundColor: Colors.redColor,
    borderRadius: 10 * 2.0,
    paddingHorizontal: 10 + 6.0,
    paddingVertical: 10 - 7.0,
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
  textFieldStyle: {
    fontSize: 14,
    color: Colors.whiteColor,
    backgroundColor: Colors.secondaryColor,
    marginVertical: 10 - 3.0,
  },
  bottomSheetDividerStyle: {
    backgroundColor: Colors.secondaryColor,
    height: 1.0,
    marginVertical: 10,
    marginHorizontal: 10 * 2.0,
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

export default PostJobScreen;
