import { Dimensions } from "react-native";

 // FOR CONSTANTS
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const ASPECT_RATIO = windowWidth / windowHeight;
export const LATITUDE_DELTA =  0.0122
// 0.04864195044303443
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO