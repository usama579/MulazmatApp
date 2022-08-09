import { Animated, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useState, useEffect,useRef} from 'react'
import MapView, { Marker } from 'react-native-maps'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geocoder from 'react-native-geocoding';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'; // IMPORT GOOGLE PLACE AUTOCOMPLETE
import { LATITUDE_DELTA, LONGITUDE_DELTA, windowHeight, windowWidth } from '../../../constants/constants';
import routes from '../../../navigation/routes';

Geocoder.init("AIzaSyAKUCt72tY8JJ3OvPz7tyorPor7E5Mf_no");

export default function PickLocationScreen({route,navigation}) {
    const {regionValue} = route.params
    
    const [region, setregion] = useState({
        // latitude: 37.78825,
        // longitude: -122.4324,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
    })
    const [address, setAddress] = useState({ "long_name": "Fulton House", "short_name": "Fulton House", "types": ["premise"] })
    const [draging, setDraging] = useState(false)
    const [show, setShow] = useState('flex')
    const [value, setValue] = useState('')
    const [dark, setDark] = useState(false)
    const mapView = useRef()
    const searchBar = useRef()
    const opacity = useRef(new Animated.Value(1)).current;
    const [addressValue, setAddressValue] = useState('')
    const addressRef = useRef() 

    useEffect(() => {
     setregion(regionValue)
     fetchAddress(regionValue)
    }, [])

     // FETCH LOCATION DETAILS AS A JSON FROM GOOGLE MAP API
     const fetchAddress = (location) =>
     {
         // Search by geo-location (reverse geo-code)
         Geocoder.from(location.latitude, location.longitude)
             .then(json =>
             {
                 var addressComponent = json.results[0].formatted_address;
                 addressRef.current?.setAddressText(addressComponent);
                 setAddressValue(addressComponent)
             })
             .catch(error => console.warn(error));
     }


   // GOOGLE PLACES AUTOCOMPLETE METHOD
   const Google_place = () =>
   {
      return (
          <>
              <GooglePlacesAutocomplete  // GOOGLE PLACE AUTOCOMPLETE USE TO SEARCH PLACES
                  placeholder={addressValue}
                  ref={addressRef}
                  query={{
                      key: 'AIzaSyAKUCt72tY8JJ3OvPz7tyorPor7E5Mf_no',
                      language: 'en', // LANGUAGE OF THE RESULTS
                  }}
                  keepResultsAfterBlur={true}
                  enablePoweredByContainer={false}
                  nearbyPlacesAPI='GooglePlacesSearch'
                  disableScroll={false}
                  autoFillOnNotFound={true}
                  fetchDetails
                  styles={{
                      container:{flex:1,},
                      textInputContainer:{paddingVertical:15,flex:1,alignSelf:"center",},
                      textInput:{color:'black'}
                  }}
                  enableHighAccuracyLocation={true}
                  numberOfLines={1}
                  GooglePlacesDetailsQuery={{
                      fields: 'geometry',
                  }}
                  onFail={(error) => console.error(error)}
                  textInputProps=
                  {{
                      placeholderTextColor: 'black',
                      returnKeyType: "search",
                      numberOfLines:1,
                      clearTextOnFocus: true,
                      style:styles.autoCompleteStyle,
                      // CLEAR INPUT AND INCREASE SIZE OF BOTTOM SHEET WHEN USER SEARCH FOR LOCATION
                      onFocus: () =>
                      {
                          setAddressValue('')
                      },
                  }}
                  
                  isRowScrollable={false}
                  renderLeftButton=
                  {
                      () =>
                      <TouchableOpacity onPress={() =>  navigation.goBack()
                      }
                        style={styles.icon}>
                          <Ionicons name={'arrow-back'} color={'black'} size={30} />
                          </TouchableOpacity>
                  }
                  onPress={(data, details = null) =>
                  {
                      const pickedLoc =
                      {
                          latitude: details?.geometry.location.lat,
                          longitude: details?.geometry.location.lng,
                          latitudeDelta: LATITUDE_DELTA,
                          longitudeDelta: LONGITUDE_DELTA
                      }
                      setregion(pickedLoc); // SET REGION WITH RESULT
                      mapView.current.animateToRegion(pickedLoc); // ANIMATE TO REGION AFTER SEARCH
                      setAddressValue(details?.formatted_address) // SET USER LOCATION WITH RESULT
                      fetchAddress(pickedLoc)
                  }
                  }
              />
          </>
      )
  }

  return (
    <>
     <View style={[styles.searchbar, styles.shadow]}>
        {Google_place()}
    </View>
    <SafeAreaView style={{flex:1}}>
        
       <MapView
                // provider={PROVIDER_GOOGLE}
                ref={mapView}
                style={styles.map}
                region={region}
                // customMapStyle={dark ? mapStyle : []}
                showsUserLocation
                onRegionChange={(region) => {
                    console.log("region:", region)
                    // setregion(region)
                    // setDraging(true)
                }}
            onRegionChangeComplete={(region) => {
                console.log('reduzhui',region)
                setregion(region)
                // setDraging(false)
                fetchAddress(region)
            }}>
               
            </MapView>
            <View style={{...styles.markerFixed}}>
                <FontAwesome5 name="map-pin" size={35} color={'red'}/> 
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>{
                navigation.navigate({
                    name: routes.JOB_POST_SCREEN,
                    params: { region: region, locationName: addressValue },
                    merge: true,
                  })
            }}>
                <Text style={styles.buttonText}> Save </Text>
            </TouchableOpacity>
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
    map:{
        flex:1
    },
    searchbar:
    {
        flexDirection: 'row',
        paddingHorizontal: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '5%',
        flex:1,
        zIndex: 20
    },
    shadow:
    {
        shadowColor: 'grey',
        shadowOpacity: 0.7,
        shadowRadius: 2,
        shadowOffset: {height: 1.5, width: 1.5},
        elevation: 3
    },
    markerFixed: {
        position:'absolute',
        left: Platform.OS == 'ios' ? windowWidth * 0.5 : windowWidth * 0.34, 
        top: windowHeight/2
    },
    autoCompleteStyle:{
        backgroundColor:'white',
        width:windowWidth*0.8,
        borderRadius:16,
        padding:20,
        justifyContent:'center'
    },
    icon: {
        height: 50,
        width:50,
        justifyContent:'center',
        alignItems:'center',
        marginTop:4,
        marginHorizontal: 10,
        backgroundColor:'white',
        borderRadius: 10
    },
    button: {
        height: 50,
        width: windowWidth*0.85,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        position:'absolute',
        bottom: 80,
        zIndex: 30
    },
    buttonText:{
        fontSize: 16,
        textAlign:'center',
        color:'black',
        fontWeight: '600'
    }

})