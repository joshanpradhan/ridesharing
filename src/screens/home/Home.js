import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as theme from "../../constants/theme.js";
import { Button, Block, Text, Empty } from "../../components/Index.js";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import  address from "../../constants/address.js";
import { UserContext } from "../../context/UserContext.js";
import axios from "axios";
import { rideHistoryUrl,clubUrl,savedAddressUrl } from "../../constants/url.js";

export default Home = ({ navigation }) => {
  //set the laoding true when you are calling api
  const [loading, setLoading] = useState(false);
  const [savedAddressData, setSavedAddressData] = useState(address);
  const [refreshing, setRefreshing] = useState(false);
  const [clubData, setClubData] = useState();
  const context = useContext(UserContext);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRideRequestData();
    getClubData();
    getSavedAddressData();
    setRefreshing(false);
  });
  const getRideRequestData = async () => {
    try {
      await axios({
        method: "GET",
        url: rideHistoryUrl,
      }).then(function (response) {

        response.data.find((item) => {
          const passenger = item.passenger;
          if ((item.rideStatus == "Pending")  && passenger.id == context.user.id) {
            navigation.navigate("Searching Rider");
          }
          if ((item.rideStatus == "Accepted")  && passenger.id == context.user.id) {
            navigation.navigate("Rider Information");
          }
         
        });
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getClubData = async () => {
    try {
      await axios({
        method: "GET",
        url: clubUrl,
      }).then(function (response) {
        setClubData(response.data)
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getSavedAddressData = async () => {
    try {
      await axios({
        method: "GET",
        url: savedAddressUrl,
      }).then(function (response) {
        const newAddressData = response.data.filter((item) => {
          const user = item.user;
          if (item.user !== null) {
            return user.id == context.user.id;
          }
        });
        setSavedAddressData(newAddressData);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const source = axios.CancelToken.source();
    getRideRequestData();
    getClubData();
    getSavedAddressData();
    return () => {
      source.cancel();
    };
  }, []);

  const SavedAddressItem = ({ icon, title, description,destinationPointCoordinateLatitude,destinationPointCoordinateLongitude }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          marginRight: 5,
          borderRadius: 5,
          paddingVertical: 5,
          paddingHorizontal: 5,
          backgroundColor: theme.colors.maroon,
        }}
      >
        <Block row center style={{ justifyContent: "space-between" }}>
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={theme.colors.white}
            style={{ marginRight: 5 }}
          />
          <Block row>
            <Block>
              <Text color={theme.colors.white} h4 numberOfLines={1}>
                {title}
              </Text>
              <Text color={theme.colors.white} h4 numberOfLines={1}>
                {description}
              </Text>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  };

  const ClubItem = ({ title, icon, description }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Event Detail", { club: title })}
        style={{
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.gray2,
        }}
      >
        <Block row center style={{ justifyContent: "space-between" }}>
          <Ionicons
            name={icon}
            size={28}
            color={theme.colors.maroon}
            style={{ marginRight: 5 }}
          />

          <Block row>
            <Block>
              <Text
                h4
                center
                numberOfLines={1}
                color={theme.colors.white}
                style={{
                  backgroundColor: theme.colors.maroon,
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                {title}
              </Text>
              <Text bold h4 numberOfLines={2} style={{ padding: 5 }}>
                {description}
              </Text>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <Block style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Block
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: theme.colors.gray2,
            }}
          > 
            <Block row center style={{ flex: 1 }}>
              <Image
                source={require("../../assets/icons/scooter.png")}
                style={{ height: 50, width: 50, marginRight: 10 }}
              />
              <Block>
                <Text bold style={{ fontSize: 24 }}>
                  ApexLyft                </Text>
                <Text bold style={{ fontSize: 16 }}>
                  Share your vehicle with others
                </Text>
              </Block>
            </Block>

            <Block row center>
              <Text bold style={{ fontSize: 20, marginRight: 5 }}>
                Welcome, {context.user.fullName}
              </Text>
             
            </Block>
          </Block>

          <Block style={{ flex: 1, marginTop: 5 }}>
            <Text bold style={{ fontSize: 16, marginVertical: 5 }}>
              Saved Address
            </Text>
            <FlatList
              data={savedAddressData}
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => <Empty title="saved address" />}
              keyExtractor={(item) => {
                return item.id.toString();
              }}
              refreshControl={
                <RefreshControl
                  colors={[theme.colors.maroon]}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              ItemSeparatorComponent={() => {
                return <Block style={{ marginBottom: 10 }} />;
              }}
              renderItem={(post) => (
                <SavedAddressItem
                  icon={post.item.icon}
                  title={post.item.title}
                  description={post.item.description}
                  destinationPointCoordinateLatitude={post.item.destinationPointLatitudeCoordinate}
                  destinationPointCoordinateLongitude={post.item.destinationPointLongitudeCoordinate}
                />
              )}
            />
          </Block>

          <Button
            style={{ marginVertical: 5 }}
            onPress={() => navigation.navigate("AppMap")}
          >
            <Block row center>
              <Text button>Set marker on you destination</Text>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                color={theme.colors.white}
                style={{ marginLeft: 10 }}
              />
            </Block>
          </Button>

          <Block flex={3}>
            <Text bold style={{ fontSize: 16, marginVertical: 5 }}>
              Upcoming events of club
            </Text>
            <FlatList
              data={clubData}
              pagingEnabled={true}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => <Empty title="club" />}
              keyExtractor={(item) => {
                return item.id.toString();
              }}
              ItemSeparatorComponent={() => {
                return <Block style={{ marginBottom: 10 }} />;
              }}
              renderItem={(post) => (
                <ClubItem
                  id={post.item.id}
                  icon={post.item.icon}
                  title={post.item.title}
                  description={post.item.description}
                />
              )}
            />
          </Block>
        </Block>
      )}
    </SafeAreaView>
  );
};
