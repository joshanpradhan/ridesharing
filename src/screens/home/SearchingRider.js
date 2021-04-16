import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import { StyleSheet, Image, ActivityIndicator } from "react-native";
import { Button, Block, Text } from "../../components/Index.js";
import * as theme from "../../constants/theme.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import { rideHistoryUrl } from "../../constants/url.js";

export default SearchingRider = ({ navigation }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getAsyncValue = async () => {
    try {
      await AsyncStorage.getItem("@rideHistory").then((jsonvalue) => {
        setData(JSON.parse(jsonvalue));
        checkRideAccepted(JSON.parse(jsonvalue));
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const CancelRide = async (jsonvalue) => {
    try {
      await axios({
        method: "PUT",
        url: `${rideHistoryUrl}/${jsonvalue.rideHistoryId}`,
        data: {
          rideStatus: "Cancelled",
        },
      }).then(function (response) {
        showMessage({
          message: "Successfully cancelled ride request",
          type: "success",
        });
        navigation.navigate("Home");
        setLoading(false);
      });
    } catch (error) {
      showMessage({
        message: "Sorry, we could not proceed your request. Try again!",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const checkRideAccepted = async (data) => {
    try {
      await axios({
        method: "GET",
        url: `${rideHistoryUrl}/${data.rideHistoryId}`,
      }).then(async (response) => {
        if (response.data.rideStatus == "Accepted") {
          // navigation.navigate("Rider Information")
          await AsyncStorage.setItem(
            "@rideHistory",
            JSON.stringify({
              rideHistoryId: response.data.id,
              verificationCode: response.data.verificationCode,
              riderId: response.data.rider.id,
              pickupInfo: response.data.pickupInfo,
              destinationInfo: response.data.destinationInfo,
              riderMessage: response.data.riderMessage,
            })
          );
          
          navigation.navigate("Rider Information");
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const interval = setInterval(() => {
      getAsyncValue();
    }, 5000);
    return () => {
      source.cancel();
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
        <Block>
          <Block
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              top: Constants.statusBarHeight,
            }}
          >
            <Text h3 style={{ marginBottom: 6 }}>
              Searching for a rider...
            </Text>
            <Text bold style={{ marginBottom: 6, fontSize: 18 }}>
              We're searching for riders and rides next to you, it can take few
              minutes. So, hold on...
            </Text>
          </Block>
          <Block row middle>
            <Image
              source={require("../../assets/icons/scooter.png")}
              style={{ height: 100, width: 100 }}
            />
          </Block>

          <Block style={{ paddingHorizontal: 20}}>
            <Block row>
              <MaterialCommunityIcons
                name="human-greeting"
                size={20}
                color={theme.colors.maroon}
                style={{ marginRight: 5 }}
              />
              <Text bold style={{ fontSize: 18 }}>
                {data.pickupInfo}
              </Text>
            </Block>
            <Block row>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="green"
                style={{ marginRight: 5 }}
              />
              <Text bold style={{ fontSize: 18 }}>
                {data.destinationInfo}
              </Text>
            </Block>
            <Block row>
              <MaterialCommunityIcons
                name="message-bulleted"
                size={20}
                color="green"
                style={{ marginRight: 5 }}
              />
              <Text bold style={{ fontSize: 18 }}>
                {data.riderMessage}
              </Text>
            </Block>
          </Block>

          <Block style={{paddingHorizontal:20}}>
            <Button
              style={{
                backgroundColor: theme.colors.red,
              }}
              onPress={() => {
                setLoading(!loading);
                CancelRide(data);
              }}
            >
              <Text button>Cancel</Text>
            </Button>
          </Block>
        </Block>
      )}
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
