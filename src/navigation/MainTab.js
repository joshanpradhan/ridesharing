import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import * as theme from "../constants/theme";
import Home from "../screens/home/Home";
import Notifications from "../screens/notifications/Notifications";
import History from "../screens/rideHistory/History";
import Settings from "../screens/settings/Settings";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarIcon: ({  color }) => {
    let iconName;
    if (route.name === "HomeStack") {
      iconName = "md-home-outline";
    } else if (route.name === "SettingsStack") {
      iconName = "settings-outline";
    } else if (route.name === "HistoryStack") {
      iconName = "timer-outline";
    } else if (route.name === "NotificationsStack") {
      iconName = "notifications-outline";
    }

    return <Ionicons name={iconName} color={color} size={28} />;
  },
});

export default MainTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={screenOptions}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: theme.colors.maroon,
        inactiveTintColor: theme.colors.gray,
        style: {
          paddingBottom: 5,
          height: 50,
        },
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="NotificationsStack" component={NotificationsStack} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} />
      <Tab.Screen name="SettingsStack" component={SettingsStack} />
    </Tab.Navigator>
  );
};

const HomeRoute = createStackNavigator();

function HomeStack() {
  return (
    <HomeRoute.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <HomeRoute.Screen name="Home" component={Home} />
    </HomeRoute.Navigator>
  );
}
const NotificationsRoute = createStackNavigator();

function NotificationsStack() {
  return (
    <NotificationsRoute.Navigator
      screenOptions={{
        headerShown: true,
        headerLeft: null,
      }}
      initialRouteName="Notifications"
    >
      <NotificationsRoute.Screen
        name="Notifications"
        component={Notifications}
      />
    </NotificationsRoute.Navigator>
  );
}

const HistoryRoute = createStackNavigator();

function HistoryStack() {
  return (
    <HistoryRoute.Navigator
      screenOptions={{
        headerShown: false,
        headerLeft: null,
      }}
      initialRouteName="History"
    >
      <HistoryRoute.Screen name="History" component={History} />
    </HistoryRoute.Navigator>
  );
}

const SettingsRoute = createStackNavigator();

function SettingsStack() {
  return (
    <SettingsRoute.Navigator
      screenOptions={{
        headerShown: true,
        headerLeft: null,
      }}
      initialRouteName="Settings"
    >
      <SettingsRoute.Screen name="Settings" component={Settings} />
    </SettingsRoute.Navigator>
  );
}
