import React from 'react'
import { View } from "react-native";
import NormalText from "./NormalText";
import Colors from "../constants/Colors";
import CheckBox from "./CheckBox";


const SelectJobType = ({getType, headingStyle}) => {
  const [regularJob, setRegularJob] = React.useState(false);
  const [timeDurationJob, setTimeDurationJob] = React.useState(false);

  const handleJobTypeSelection = (isRegularClicked) => {
    if (isRegularClicked){
      setRegularJob((currentVal)=> !currentVal)
      setTimeDurationJob(false);
      getType(!regularJob === true && "Regular" )
    }else{
      setRegularJob(false)
      setTimeDurationJob((currentVal)=> !currentVal)
      getType(!timeDurationJob === true &&"Time Duration")
    }
  }

  return (
    <View style={{ width:'100%',alignSelf: 'center',}}>
      <NormalText style={{...{ marginTop:20,marginBottom:10, color:Colors.primaryColor}, ...headingStyle}}>Select Job Type</NormalText>
      <CheckBox  checked={regularJob}  onPress={()=>handleJobTypeSelection(true)} label={"Regular Job"} />
      <CheckBox  checked={timeDurationJob}  onPress={()=>handleJobTypeSelection(false)} label={"Time Duration"} />
    </View>
  )
}



export default  SelectJobType
