import React, { useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as theme from "../constants/theme.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MainTab from "./MainTab";
import Onboarding from "../screens/auth/Onboarding";
import Welcome from "../screens/auth/Welcome";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Forgot from "../screens/auth/Forgot";

import AppMap from "../screens/home/AppMap";
import AddAddressMap from "../screens/home/AddAddressMap";
import AddAddressInfo from "../screens/home/AddAddressInfo";
import EventDetail from "../screens/home/EventDetail";
import SearchingRider from "../screens/home/SearchingRider";
import RiderInformation from "../screens/home/RiderInformation";
import RiderRating from "../screens/home/RiderRating";
import SendRequest from "../screens/home/SendRequest";

import Profile from "../screens/settings/Profile";
import Address from "../screens/settings/Address";
import Privacy from "../screens/settings/Privacy";
import FAQ from "../screens/settings/FAQ";
import ChangePassword from "../screens/settings/ChangePassword";
import AboutUs from "../screens/settings/AboutUs.js";
import OfflineNotice from "../components/OfflineNotice.js";


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.maroon,
    background: theme.colors.gray2,
  },
};

const Stack = createStackNavigator();
export default App = () => {
  
  const [viewedOnboarding, setViewedOnboarding] = useState(null);
  let routeName;
  useEffect(() => {
    AsyncStorage.getItem("@viewedOnboarding").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("@viewedOnboarding", "true");
        setViewedOnboarding(true);
      } else {
        setViewedOnboarding(false);
      }
    });
  }, []); // Add


  if (viewedOnboarding === null) {
    return null;
  } else if (viewedOnboarding == true) {
    routeName = "Onboarding";
  } else {
    routeName = "Welcome";
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName={routeName}>
        <Stack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
          component={Onboarding}
        />
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={Welcome}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: true }}
          component={Login}
        />
        <Stack.Screen
          name="Register"
          options={{ headerShown: true }}
          component={Register}
        />
        <Stack.Screen
          name="Forgot Password"
          options={{ headerShown: true }}
          component={Forgot}
        />
        <Stack.Screen
          name="MainTab"
          options={{ headerShown: false }}
          component={MainTab}
        />
        <Stack.Screen
          name="AppMap"
          options={{ headerShown: false }}
          component={AppMap}
        />
         <Stack.Screen
          name="AddAddressMap"
          options={{ headerShown: false }}
          component={AddAddressMap}
        />
         <Stack.Screen
          name="AddAddressInfo"
          options={{ headerShown: false }}
          component={AddAddressInfo}
        />
        <Stack.Screen
          name="SendRequest"
          options={{ headerShown: false }}
          component={SendRequest}
        />

        <Stack.Screen
          name="Event Detail"
          options={({ route }) => ({ title: route.params.club })}
          component={EventDetail}
        />

        <Stack.Screen
          name="Searching Rider"
          options={{ headerShown: false }}
          component={SearchingRider}
        />
        <Stack.Screen
          name="Rider Information"
          options={{ headerShown: false }}
          component={RiderInformation}
        />
        <Stack.Screen
          name="Rider Rating"
          options={{ headerShown: true }}
          component={RiderRating}
        />

        <Stack.Screen
          name="Change Password"
          options={{ headerShown: true }}
          component={ChangePassword}
        />
        <Stack.Screen
          name="Account Profile"
          options={{ headerShown: true }}
          component={Profile}
        />
        <Stack.Screen
          name="Saved Address"
          options={{ headerShown: true }}
          component={Address}
        />
        <Stack.Screen
          name="Privacy Policy"
          options={{ headerShown: true }}
          component={Privacy}
        />
        <Stack.Screen
          name="FAQ"
          options={{ headerShown: true }}
          component={FAQ}
        />
        <Stack.Screen
          name="About Us"
          options={{ headerShown: true }}
          component={AboutUs}
        />
      </Stack.Navigator>
      <OfflineNotice/>
      
    </NavigationContainer>
  );
};
