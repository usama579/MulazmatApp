import React,{useState} from 'react';
import { StyleSheet, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from "../constants/Colors";


const SelectCategoryDropDown = ({selectedValue,setSelectedValue,style}) => {
  //status picker
  const [openStatus, setOpenStatus] = useState(false);
  const [statusItems, setStatusItems] = useState([
    { label: 'Teaching', value: 'Teaching' },
    { label: 'House Keeping', value: 'House Keeping' },
    { label: 'Baby Siting', value: 'Baby Siting' },
    { label: 'Made', value: 'Made' },
    { label: 'Cook', value: 'Cook' },
    { label: 'Receptionist', value: 'Receptionist' },
    { label: 'Computer Operator', value: 'Computer Operator' },
  ]);

  return<View style={{width: '100%', alignSelf:'center', zIndex:1}}>
    <DropDownPicker
      placeholder="Select Category"
      open={openStatus}
      value={selectedValue}
      items={statusItems}
      setOpen={setOpenStatus}
      setValue={setSelectedValue}
      setItems={setStatusItems}
      style={{...styles.dropdown, ...style}}
      textStyle={{
        color:Colors.primaryColor
      }}
    />
  </View>
}

const styles = StyleSheet.create({
  dropdown:{
    marginTop:15,
    backgroundColor: Colors.secondaryColor,
    borderColor: Colors.blackColor,
  }
})

export default SelectCategoryDropDown
