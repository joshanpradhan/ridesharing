import React, { useState, useEffect, useContext, useRef } from "react";
import { Image, Linking, Platform, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as theme from "../../constants/theme.js";
import { Button, Block, Text, OutlinedButton } from "../../components/Index.js";
import { showMessage } from "react-native-flash-message";
import { UserContext } from "../../context/UserContext.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rideHistoryUrl, ridersUrl } from "../../constants/url.js";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
export default RiderInformation = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [riderInfo, setRiderInfo] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const context = useContext(UserContext);
 
  const getAsyncValue = async () => {
    try {
      await AsyncStorage.getItem("@rideHistory").then((jsonvalue) => {
        setData(JSON.parse(jsonvalue));
        getRiderData(JSON.parse(jsonvalue));
        checkRiderStartedRide(JSON.parse(jsonvalue))
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const MakeCall = () => {
    if (Platform.OS !== "android") {
      mobileNo = `telprompt:${riderInfo.mobileNo}`;
    } else {
      mobileNo = `tel:${riderInfo.mobileNo}`;
    }
    Linking.canOpenURL(mobileNo)
      .then((supported) => {
        if (!supported) {
          showMessage({
            message: "Number is not available",
            type: "info",
          });
        } else {
          return Linking.openURL(mobileNo);
        }
      })
      .catch((err) => console.log(err));
  };

  const LeaveMessage = () => {
    if (Platform.OS !== "android") {
      sms = `sms:${riderInfo.mobileNo}`;
    } else {
      sms = `sms:${riderInfo.mobileNo}`;
    }
    Linking.canOpenURL(sms)
      .then((supported) => {
        if (!supported) {
          showMessage({
            message: "Number is not available",
            type: "info",
          });
        } else {
          return Linking.openURL(sms);
        }
      })
      .catch((err) => console.log(err));
  };

  const CancelRide = async (jsonvalue) => {
    console.log("CancelRide by user");
    console.log(jsonvalue);
    try {
      await axios({
        method: "PUT",
        url: `${rideHistoryUrl}/${jsonvalue.rideHistoryId}`,
        data: {
          rideStatus: "Cancelled",
          // riderCancelNote: riderCancelNote,
        },
      }).then(async (response) => {
        showMessage({
          message: "Successfully cancelled ride request",
          type: "success",
        });
        setLoading(false);
        await sendPushNotification(
          response.data.rider.expoPushToken,
          context.user.fullName
        );
      });
      navigation.navigate("Home");
    } catch (error) {
      showMessage({
        message: "Sorry, we could not proceed your request. Try again!",
        type: "danger",
      });
      setLoading(false);
    }
  };
  const getRiderData = async (jsonvalue) => {
    try {
      await axios({
        method: "GET",
        url: `${ridersUrl}/${jsonvalue.riderId}`,
      }).then(function (response) {
        setRiderInfo(response.data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const checkRiderStartedRide = async (data) => {
    try {
      await axios({
        method: "GET",
        url: `${rideHistoryUrl}/${data.rideHistoryId}`,
      }).then(async (response)=>{
        if(response.data.rideStatus=="Completed"){
          // navigation.navigate("Rider Information")
          navigation.navigate("Rider Rating",{"rideHistoryId":data.rideHistoryId});
        }
        if(response.data.rideStatus=="Cancelled"){
          // navigation.navigate("Rider Information")
          navigation.navigate("Home");
        }
    })
  }catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener();
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener();
    getAsyncValue();
    const interval = setInterval(() => {
      getAsyncValue();
    }, 5000);
    return () => {
      source.cancel();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(interval);
    };
  }, []);

  return (
    <Block>
      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <Block style={{ marginTop: 10 }}>
          <Block center middle style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/secondOnboarding.png")}
              style={{
                height: 150,
                width: 150,
                borderRadius: 70,
              }}
            />
          </Block>

          <Block
            style={{
              flex: 2,
              paddingHorizontal: 15,
            }}
          >
            <Block
              style={{
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: theme.colors.white,
              }}
            >
              <Block
                romiddle
                style={{
                  flex: 0.5,
                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Rider Information
                </Text>
              </Block>
              <Block
                row
                style={{
                  flex: 0.5,
                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Full name:
                </Text>
                <Text h4 color={theme.colors.black}>
                  {riderInfo.fullName}
                </Text>
              </Block>

              <Block
                row
                style={{
                  flex: 0.5,
                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Email:
                </Text>
                <Text h4 color={theme.colors.black}>
                  {riderInfo.email}
                </Text>
              </Block>
              <Block
                row
                style={{
                  flex: 0.5,

                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Mobile No:
                </Text>
                <Text h4 color={theme.colors.black}>
                  {riderInfo.mobileNo}
                </Text>
              </Block>
              <Block
                row
                style={{
                  flex: 0.5,

                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Ride Completed:
                </Text>
                <Text h4 color={theme.colors.black}>
                  {riderInfo.rideCompleted}
                </Text>
              </Block>
              <Block
                row
                style={{
                  flex: 0.5,

                  paddingHorizontal: 20,
                }}
              >
                <Text h4 color={theme.colors.black}>
                  Verification Code:
                </Text>
                <Text h4 color={theme.colors.black}>
                  {data.verificationCode}
                </Text>
              </Block>

              <Block
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <OutlinedButton onPress={() => MakeCall()}>
                  <Block row center>
                    <Text outlinedButton>Give Call</Text>
                    <MaterialCommunityIcons
                      name="cellphone-iphone"
                      size={24}
                      color={theme.colors.maroon}
                      style={{ marginLeft: 5 }}
                    />
                  </Block>
                </OutlinedButton>
              </Block>
              <Block
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <OutlinedButton onPress={() => LeaveMessage()}>
                  <Block row center>
                    <Text outlinedButton>Leave message</Text>
                    <MaterialCommunityIcons
                      name="message-text"
                      size={24}
                      color={theme.colors.maroon}
                      style={{ marginLeft: 5 }}
                    />
                  </Block>
                </OutlinedButton>
              </Block>

              <Block
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <Button
                  style={{
                    backgroundColor: theme.colors.red,
                  }}
                  onPress={() => CancelRide(data)}
                >
                  <Block row center>
                    <Text button>Cancel Ride</Text>
                  </Block>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      )}
    </Block>
  );
};

async function sendPushNotification(expoPushToken, fullName) {
    console.log("sendPushNotification");
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Sorry",
    body: `${fullName} has cancelled your ride`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
