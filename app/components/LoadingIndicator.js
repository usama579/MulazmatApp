import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import Colors from '../constants/Colors';

const LoadingIndicator = ({loading}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={loading}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    </Modal>
  );
};

export default LoadingIndicator;
