import React, {useState} from 'react';
import {View, StyleSheet, Modal, ActivityIndicator} from 'react-native';

import Colors from '../constants/Colors';
import MyButton from './MyButton';
import NormalText from './NormalText';
import SmallText from './SmallText';

import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SuccessDialog from './SuccessDialog';
import ErrorDialog from './ErrorDialog';

import lang from '../constants/DefaultLanguage';

const InterviewDialog = props => {
  // interview
  const [date, setDate] = useState(new Date(Date.now()));
  const [errorMsg, setErrorMsg] = useState('');

  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = time => {
    return `${time.getHours()}:${time.getMinutes()}`;
  };

  const onDateChange = selectedDate => {
    currentDate = Date.now();
    if (selectedDate < currentDate) {
      setErrorMsg(lang.l202);
      setDate(new Date(Date.now()));
    } else {
      setErrorMsg('');
      setDate(selectedDate);
    }
  };

  return (
    <Modal animationType="slide" visible={props.visibility} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(52,52,52,0.7)',
        }}>
        <View
          style={{
            width: '100%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            backgroundColor: Colors.whiteColor,
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}>
          <SuccessDialog
            visibility={props.successDialogShow}
            msg={props.msg}
            onPress={props.onPressSuccessOk}
          />
          <ErrorDialog
            visibility={props.errorDialogVisibility}
            msg={props.msg}
            onPress={props.onPressErrorOk}
          />
          {
            //Loading
          }
          <Modal
            animationType="fade"
            transparent={true}
            visible={props.loaderVisible}>
            <View style={{flex: 1}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          </Modal>

          <NormalText>{lang.l203}</NormalText>
          {errorMsg !== '' ? (
            <NormalText style={{color: Colors.redColor}}>{errorMsg}</NormalText>
          ) : null}

          {props.isReschedule ? (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 5,
                alignSelf: 'flex-end',
              }}>
              <SmallText>{lang.l101}:</SmallText>
              <SmallText style={{color: Colors.redColor, marginLeft: 5}}>
                {props.date}
              </SmallText>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <View style={styles.card}>
              <NormalText>{lang.l92}: </NormalText>
              <NormalText style={{color: Colors.primaryColor}}>
                {formatDate(date)}
              </NormalText>
            </View>

            <View style={styles.card}>
              <NormalText>{lang.l93}: </NormalText>
              <NormalText style={{color: Colors.primaryColor}}>
                {formatTime(date)}
              </NormalText>
            </View>
          </View>

          <View style={{alignSelf: 'center'}}>
            <DatePicker date={date} onDateChange={onDateChange} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
            }}>
            <MyButton
              style={{width: '47%'}}
              title={' ' + lang.l94 + ' ' + lang.l96}
              onPress={
                errorMsg != ''
                  ? () => setErrorMsg(lang.l204)
                  : () => props.onSend(formatDate(date), formatTime(date))
              }>
              <Ionicons name="arrow-up" size={24} color={Colors.whiteColor} />
            </MyButton>
            <MyButton
              style={{width: '47%', backgroundColor: Colors.redColor}}
              title={' ' + lang.l95 + ' ' + lang.l96}
              onPress={props.onClose}>
              <Ionicons
                name="close-circle"
                size={24}
                color={Colors.whiteColor}
              />
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    width: '48%',
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default InterviewDialog;
