import React, { useState,useContext,useRef,useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Formik } from "formik";
import Constants from "expo-constants";
import * as Yup from "yup";
import * as theme from "../../constants/theme.js";
import { showMessage } from "react-native-flash-message";
import {
  Button,
  Block,
  Text,
  Input,
  ErrorMessage,
} from "../../components/Index.js";
import * as Notifications from "expo-notifications";
import { rideHistoryUrl,userProfileUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = Yup.object().shape({
  currentLocation: Yup.string()
    .required()
    .min(6)
    .max(100)
    .label("Current Location"),
  destinationLocation: Yup.string()
    .required()
    .min(6)
    .max(100)
    .label("Destination Location"),
  extraNote: Yup.string().label("Extra Note"),
});
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default SendRequest = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();
  const context = useContext(UserContext);

  const onSubmitRideRequest = async (values) => {
    console.log(context.user);
    try {
      await axios({
        method: "POST",
        url: rideHistoryUrl,
        data: {
          passenger:context.user.id,
          rideStatus: "Pending",
          cost: 30,
          pickupPointLatitudeCoordinate:route.params.pickupPointCoordinateLatitude,
          pickupPointLongitudeCoordinate:route.params.pickupPointCoordinateLongitude,
          destinationPointLatitudeCoordinate:route.params.destinationPointCoordinateLatitude,
          destinationPointLongitudeCoordinate:route.params.destinationPointCoordinateLongitude,
          pickupInfo: values.currentLocation,
          destinationInfo: values.destinationLocation,
          riderMessage:values.extraNote
        },
      }).then(async(response)=>{
        showMessage({
          message: "Success, your ride request is in progress. Wait for rider confirmation",
          type: "success",
        });
        await AsyncStorage.setItem(
          "@rideHistory",
          JSON.stringify({
            rideHistoryId: response.data.id,
            pickupInfo:response.data.pickupInfo,
            destinationInfo:response.data.destinationInfo,
            riderMessage: response.data.riderMessage,
          })
        );
        setLoading(false);
        navigation.navigate("Searching Rider");
      })
      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    try {
      await axios({
        method: "PUT",
        url: `${userProfileUrl}/${context.user.id}`,
        data: {
          expoPushToken:expoPushToken,
          //replace provider with expoPushToken in database model
        },
      }).then(async(response)=>{
        setLoading(false);
      })
      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener();
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener();
    return () => {
      source.cancel();
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ marginVertical: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Block center middle>
            <Block style={{ marginTop: 20 }}>
              <Image
                source={require("../../assets/icons/scooter.png")}
                style={{ height: 100, width: 100 }}
              />
            </Block>
            <Block flex={2.5} center>
              <Text h3 style={{ marginBottom: 6 }} color={theme.colors.maroon}>
                Please enter your credentials
              </Text>

              <Block center style={{ marginTop: 44 }}>
                <Formik
                  initialValues={{
                    currentLocation: "",
                    destinationLocation: "",
                    extraNote: "",
                  }}
                  onSubmit={(values) => {
                    setLoading(!loading);
                    onSubmitRideRequest(values)}
                  }
                  validationSchema={validationSchema}
                >
                  {({
                    handleChange,
                    touched,
                    setFieldTouched,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Block>
                      <Input
                        full
                        autoFocus={true}
                        label="current location info"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("currentLocation")}
                        onBlur={() => setFieldTouched("currentLocation")}
                        value={values.currentLocation}
                      />
                      <ErrorMessage
                        error={errors.currentLocation}
                        visible={touched.currentLocation}
                      />

                      <Input
                        full
                        label="Destination location info"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("destinationLocation")}
                        onBlur={() => setFieldTouched("destinationLocation")}
                        value={values.destinationLocation}
                      />
                      <ErrorMessage
                        error={errors.destinationLocation}
                        visible={touched.destinationLocation}
                      />
                      <Input
                        full
                        label="Extra note to rider(Example:Need assistance)"
                        style={{ marginBottom: 5 }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("extraNote")}
                        onBlur={() => setFieldTouched("extraNote")}
                        value={values.extraNote}
                      />
                      <ErrorMessage
                        error={errors.extraNote}
                        visible={touched.extraNote}
                      />
                      {!errors.currentLocation &&
                      !errors.destinationLocation &&
                      !errors.extraNote ? (
                        <Block>
                          <Button
                            full
                            style={{
                              marginBottom: 12,
                            }}
                            onPress={handleSubmit}
                          >
                            {loading ? (
                              <ActivityIndicator
                                size="small"
                                color={theme.colors.white}
                              />
                            ) : (
                              <Text button>Send ride request</Text>
                            )}
                          </Button>
                        </Block>
                      ) : (
                        <Block>
                          <Button
                            full
                            style={{
                              marginBottom: 12,
                              backgroundColor: theme.colors.gray,
                            }}
                            disabled={true}
                          >
                            <Text button>Send ride request</Text>
                          </Button>
                        </Block>
                      )}

                      <Button
                        full
                        style={{
                          marginBottom: 12,
                          backgroundColor: theme.colors.red,
                        }}
                        onPress={() => navigation.goBack()}
                      >
                        <Text bold color={theme.colors.white}>
                          Go back
                        </Text>
                      </Button>
                    </Block>
                  )}
                </Formik>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


async function sendPushNotification(expoPushToken, fullName) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Congratulations",
    body: `${fullName} has accepted your ride request`,
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

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
