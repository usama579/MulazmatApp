import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import Card from './Card';
import NormalText from './NormalText';
import SmallText from './SmallText';
import Button from './MyButton';

import Ionicons from 'react-native-vector-icons/Ionicons';

const SuccessDialog = props => {
  return (
    <Modal animationType="slide" visible={props.visibility} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        }}>
        <Card style={styles.card}>
          <Ionicons name="warning" color={Colors.redColor} size={50} />
          <NormalText>Error</NormalText>
          <SmallText style={{color: Colors.redColor}}>{props.msg}</SmallText>
          <Button style={styles.okBtn} title="OK" onPress={props.onPress} />
        </Card>
      </View>
    </Modal>
  );
};

{
  /* <SuccessDialog
      msg="Applied SuccessFully"
      onPress={() => setstate(false)}
      visibility={state}
    /> */
}

const styles = StyleSheet.create({
  card: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  okBtn: {
    marginVertical: 0,
    marginTop: 10,
    height: 30,
    width: '50%',
    borderRadius: 6,
    backgroundColor: Colors.redColor,
  },
});

export default SuccessDialog;
