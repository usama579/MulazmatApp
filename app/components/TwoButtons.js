import React from 'react'
import { Platform, Text, TouchableNativeFeedback, TouchableOpacity, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";


const TwoButtons = ({onPressLeftBtn, onPressRightBtn, leftBtnTitle, rightBtnTitle }) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={{flexDirection: 'row'}}>
      {
        //first Button container
      }

      <View style={{flex: 1, marginRight: 4}}>
        <TouchableCmp
          onPress={onPressLeftBtn}>
          <View style={styles.jobBtn1st}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: 16,
              }}>
              {leftBtnTitle}
            </Text>
          </View>
        </TouchableCmp>
      </View>

      <View style={{flex: 1, marginLeft: 4}}>
        {
          //2nd Button
        }

        <TouchableCmp
          onPress={onPressRightBtn}>
          <View style={styles.jobBtn2st}>
            <Text
              style={{
                color: Colors.whiteColor,
                fontSize: 16,
              }}>
              {rightBtnTitle}
            </Text>
          </View>
        </TouchableCmp>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  jobBtn1st: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 7,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  jobBtn2st: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 7,
    backgroundColor: Colors.greenColor,
    borderRadius: 5,
  },
});

export  default TwoButtons;
