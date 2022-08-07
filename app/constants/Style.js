import {StyleSheet} from 'react-native';
import Colors from './Colors';

module.exports = StyleSheet.create({
  selectedAccountBG: {
    backgroundColor: Colors.primaryColor,
  },
  btnTouchArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
