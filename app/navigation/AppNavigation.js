import React, { useEffect, useState } from "react";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import CustomDrawer from './CustomDrawer';
import routes from './routes';

import {LogBox} from 'react-native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth_screens/LoginScreen';
import CreateAccountScreen from '../screens/auth_screens/CreateAccountScreen';
import EmployerHomeScreen from '../screens/employer_screens/EmployerHomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ChatListScreen from "../screens/chat_screens/ChatListScreen";
import ChatboxScreen from "../screens/chat_screens/ChatboxScreen";
import EmployerProfileScreen from "../screens/employer_screens/profile/EmployerProfileScreen";
import EditEmployerProfileScreen from "../screens/employer_screens/editProfile/EditEmployerProfileScreen";
import PostJobScreen from "../screens/employer_screens/post_new_job/PostJobScreen";
import PostedJobs from "../screens/employer_screens/posted_jobs/PostedJobs";
import AppointmentsScreen from "../screens/employer_screens/appointments/AppointmentsScreen";
import EmployerRequestScreen from "../screens/employer_screens/requests/EmployerRequesteScreen";
import JobberRequestScreen from "../screens/job_needer_Screens/requests/JobberRequesteScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JobberHomeScreen from "../screens/job_needer_Screens/home/JobberHomeScreen";
import JobberProfileScreen from "../screens/job_needer_Screens/profile/JobberProfileScreen";
import JobDetailsScreen from "../screens/job_needer_Screens/job_details/JobberJobDetails";
import EditJobberProfileScreen from "../screens/job_needer_Screens/editProfile/EditJobberProfileScreen";
import EmployerJobDetailScreen from "../screens/employer_screens/posted_jobs/EmployerJobDetails";
import SOSEmergency from "../screens/job_needer_Screens/sos_emergency/SOSEmergency";
import MySchedule from "../screens/schedul/MySchedule";
import ForgotPasswordScreen from "../screens/auth_screens/ForgotPasswordScreen";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

//Main Stack
const Stack = createStackNavigator();

const MyStack = () => {

  return (
    <Stack.Navigator
      initialRouteName="Build"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={routes.SPLASH_SCREEN} component={SplashScreen} />
      <Stack.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />

      <Stack.Screen
        name={routes.CREATE_ACCOUNT_SCREEN}
        component={CreateAccountScreen}
      />

      <Stack.Screen name={routes.FORGOT_PASSWORD_SCREEN} component={ForgotPasswordScreen} />

      <Stack.Screen name={routes.EMPLOYER_JOB_DETAILS_SCREEN} component={EmployerJobDetailScreen} />
      <Stack.Screen name={routes.EDIT_EMPLOYER_PROFILE_SCREEN} component={EditEmployerProfileScreen} />

      <Stack.Screen name={routes.JOBBER_PROFILE_DETAILS_SCREEN} component={JobberProfileScreen} />
      <Stack.Screen name={routes.EDIT_JOBBER_PROFILE_SCREEN} component={EditJobberProfileScreen} />


      <Stack.Screen
        name={routes.JOB_POST_SCREEN}
        component={PostJobScreen}
      />

      <Stack.Screen
        name={routes.JOBBER_JOB_DETAILS_SCREEN}
        component={JobDetailsScreen}
      />

      <Stack.Screen
        name={routes.CHAT_BOX_SCREEN}
        component={ChatboxScreen}
      />

      {
        //Drawer
      }
      <Stack.Screen name={routes.DRAWER} component={ AppDrawer} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const AppDrawer = () => {

  const [ifUserEmployer, setIfUserIsEmployer] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('isEmployer').then(user => {
      setIfUserIsEmployer(JSON.parse(user))
    }).catch(e => console.log(e))
  },[])

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.whiteColor,
        drawerActiveTintColor: Colors.primaryColor,
        drawerInactiveTintColor: Colors.whiteColor,
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}>

      <Drawer.Screen
        name={'Home'}
        component={ifUserEmployer ? EmployerHomeScreen : JobberHomeScreen}
        options={{
          drawerIcon: ({color, focused}) => (
            <Ionicons name={'home'} size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={'Profile'}
        component={ifUserEmployer ? EmployerProfileScreen : JobberProfileScreen}
        options={{
          drawerIcon: ({color, focused}) => (
            <MaterialIcons name={'account-box'} size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={'Requests'}
        component={ifUserEmployer ? EmployerRequestScreen : JobberRequestScreen}
        options={{
          drawerIcon: ({color, focused}) => (
            <FontAwesome name={'send'} size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={'Chat'}
        component={ChatListScreen}
        options={{
          drawerIcon: ({color, focused}) => (
            <FontAwesome name={'wechat'} size={24} color={color} />
          ),
        }}
      />


      {
        !ifUserEmployer &&
        <>
          <Drawer.Screen
            name={'My Schedule'}
            component={MySchedule}
            options={{
              drawerIcon: ({color, focused}) => (
                <MaterialIcons name={'watch-later'} size={24} color={color} />
              ),
            }}
          />
        <Drawer.Screen
          name={'SOS Emergency'}
          component={SOSEmergency}
          options={{
            drawerIcon: ({color, focused}) => (
              <MaterialIcons name={'quick-contacts-dialer'} size={24} color={color} />
            ),
          }}
        />
        </>
        }

      {
        ifUserEmployer && <>
          <Drawer.Screen
            name={'Posted Jobs'}
            component={PostedJobs}
            options={{
              drawerIcon: ({color, focused}) => (
                <Ionicons name={'ios-briefcase'} size={24} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name={'Appointments'}
            component={AppointmentsScreen}
            options={{
              drawerIcon: ({color, focused}) => (
                <Ionicons name={'md-shield-checkmark'} size={24} color={color} />
              ),
            }}
          />
        </>
      }
    </Drawer.Navigator>
  );
};

export default MyStack;
