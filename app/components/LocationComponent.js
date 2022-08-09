import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { windowHeight, windowWidth } from '../constants/constants'
import MapView,{ Marker } from 'react-native-maps'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function LocationComponent({region}) {
  return (
    <View style={styles.container}>
       <MapView
                // provider={PROVIDER_GOOGLE}
                style={{flex:1,borderRadius:20}}
                region={region}
                showsUserLocation
                scrollEnabled={false}
              >
                <Marker
                coordinate={{ latitude : region.latitude , longitude : region.longitude }}
                >
                <FontAwesome5 name="map-pin" size={35} color={'red'}/> 
             </Marker>
            </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight * 0.25,
        width: windowWidth * 0.9,
        borderRadius: 15,
        alignSelf:'center'
    }
})