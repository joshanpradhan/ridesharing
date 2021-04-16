import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

import * as theme from "../../constants/theme.js";
import {Button,Text,Block, OutlinedButton} from "../../components/Index.js";

export default AddAddressMap = ({route, navigation }) => {
  const [pickupPoint, setPickupPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [confirmDestination, setConfirmDestination] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      };
      setPickupPoint(region);
    })();
  }, []);

  if (pickupPoint === null) {
    return (
      <View style={[styles.spinner, styles.horizontal]}>
        <ActivityIndicator size="large" color={theme.colors.maroon} />
      </View>
    );
  }
  if (confirmDestination) {
    if (pickupPoint !== null && destinationPoint !== null) {
      return (
        <Block flex={2}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude:destinationPoint.latitude,
              longitude:destinationPoint.longitude,
              latitudeDelta:0.045,
              longitudeDelta:0.045

            }}
            rotateEnabled={false}
            loadingEnabled={true}
          >
            <Marker
              title={"Your destination"}
              coordinate={{
                latitude: destinationPoint.latitude,
                longitude: destinationPoint.longitude,
              }}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={45}
                color="green"
              />
            </Marker>
          </MapView>
          <Button
            style={{
              marginBottom: 5,
            }}
            onPress={() =>
              navigation.navigate("AddAddressInfo", {
                icon:"office-building",
                destinationPointCoordinateLatitude: destinationPoint.latitude,
                destinationPointCoordinateLongitude: destinationPoint.longitude,
              })
            }
          >
            <Text button>Continue to proceed</Text>
          </Button>
          
          <OutlinedButton
          style={{
            backgroundColor: theme.colors.red,
          }}
          onPress={() => navigation.goBack()}
        >
          <Text bold color={theme.colors.white}>
            Cancel
          </Text>
        </OutlinedButton>
        </Block>
      );
    }
  }
  if (pickupPoint !== null) {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={pickupPoint}
          showsUserLocation={true}
          rotateEnabled={false}
          loadingEnabled={true}
          onRegionChangeComplete={(mapRegion) => setDestinationPoint(mapRegion)}
        >
          <Marker
            title={"Your location"}
            coordinate={{
              latitude: pickupPoint.latitude,
              longitude: pickupPoint.longitude,
            }}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={40}
              color={theme.colors.maroon}
            />
          </Marker>
          <View style={{ marginLeft: "44%", marginTop: "80%" }}>
            <MaterialCommunityIcons name="map-marker" size={45} color="green" />
          </View>
        </MapView>
        <Button
          style={{
            marginBottom: 5,
          }}
          onPress={() => setConfirmDestination(true)}
        >
          <Text button>Confirm Destination</Text>
        </Button>
        <Button
          style={{
            backgroundColor: theme.colors.red,

          }}
          onPress={() => navigation.goBack()}
        >
          <Text bold color={theme.colors.white}>
            Cancel
          </Text>
        </Button>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
  },

  header: {
    backgroundColor: "#f7f5eee8",
    shadowColor: "#000000",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
});
