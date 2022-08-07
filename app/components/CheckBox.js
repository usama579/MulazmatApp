import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Colors from "../constants/Colors";

function CheckBox({ label, checked, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%',alignSelf: 'center'}}>
        <Text style={{ color: checked ? Colors.primaryColor : Colors.blackColor }}>{label}</Text>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            uncheckedColor={Colors.redColor}
            color={Colors.primaryColor}
            label={"Hamza"}
           onPress={onPress}
          />
      </View>
    </TouchableOpacity>
  );
}

export default CheckBox;
