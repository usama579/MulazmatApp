import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import Card from './Card';
import NormalText from './NormalText';
import SmallText from './SmallText';
import Button from './MyButton';

import Ionicons from 'react-native-vector-icons/Ionicons';

import lang from '../constants/DefaultLanguage';
const SuccessDialog = props => {
  return (
    <Modal animationType="slide" visible={props.visibility} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
        }}>
        <Card style={styles.card}>
          <Ionicons
            name="checkmark-circle"
            color={"#067d1f"}
            size={50}
          />
          <NormalText>{lang.l84}</NormalText>
          <SmallText>{props.msg}</SmallText>
          <Button
            style={styles.okBtn}
            title={lang.l199}
            onPress={props.onPress}
          />
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
    backgroundColor:"#067d1f"
  },
});

export default SuccessDialog;
