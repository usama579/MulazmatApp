import React from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";

import Colors from "../constants/Colors";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useNavigation } from '@react-navigation/native';

const HeaderIcon = ({ isOpenDrawer}) => {
  const navigation = useNavigation();
  return (
    <View style={{marginBottom:15}}>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle="light-content"
      />
      <View>
        <TouchableOpacity onPress={() =>  isOpenDrawer ? navigation.openDrawer(): navigation.pop()}>
          {
            isOpenDrawer ?<Ionicons
            name={"ios-reorder-three-sharp"}
            color={Colors.primaryColor}
            size={30}
          /> :
            <MaterialIcons
            name={"keyboard-backspace"}
            color={Colors.primaryColor}
            size={30}
            />}
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default HeaderIcon;
