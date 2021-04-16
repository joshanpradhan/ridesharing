import React, { useState, useEffect, useContext } from "react";
import {
  RefreshControl,
  ActivityIndicator,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as theme from "../../constants/theme.js";
import { Block, Text, Empty } from "../../components/Index.js";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { rideHistoryUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";

export default History = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [rideRequestData, setRideRequestData] = useState();
  const [verifiedData, setVerifiedData] = useState();
  const [cancelledData, setCancelledData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState("All");

  const context = useContext(UserContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRideRequestData();
    setRefreshing(false);
  });

  const getRideRequestData = async () => {
    try {
      await axios({
        method: "GET",
        url: rideHistoryUrl,
      }).then(function (response) {
        const newRidersData = response.data.filter((item) => {
          const passenger = item.passenger;
          if (item.passenger !== null) {
            return passenger.id == context.user.id;
          }
        });
        setRideRequestData(newRidersData);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filterverifiedData = () => {
    const newverifiedData = rideRequestData.filter((item) => {
      return item.rideStatus == "Verified";
    });
    setVerifiedData(newverifiedData);
    setMode("Verified");
  };
  const filterCancelledData = () => {
    const newCancelledData = rideRequestData.filter((item) => {
      return item.rideStatus == "Cancelled";
    });
    setCancelledData(newCancelledData);
    setMode("Cancelled");
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    getRideRequestData();
    return () => {
      source.cancel();
    };
  }, []);

  const Item = ({
    rider,
    rideStatus,
    rideHistoryId,
    verificationCode,
    riderRating,
    dateCreated,
    cost,
    pickupInfo,
    destinationInfo,
  }) => {
    return (
      <Block
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
         
        }}
      >
        <Block
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 20,
          }}
        >
          <Block row>
            <Block row center>
              <Image
                source={require("../../assets/icons/user.png")}
                style={{ height: 25, width: 25, marginRight: 2 }}
              />
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
                {rider}
              </Text>
            </Block>

            <Block
              style={{
                alignItems: "flex-end",
              }}
            >
              <Block
                style={{
                  padding: 5,
                  backgroundColor:
                    rideStatus === "Completed"
                      ? theme.colors.green
                      : rideStatus === "Verified"
                      ? theme.colors.green
                      : theme.colors.red,
                  borderRadius: 20,
                }}
              >
                <Text bold color={theme.colors.white}>
                  {rideStatus}
                </Text>
              </Block>
            </Block>
          </Block>

          <Block row>
            <Block row center>
              <MaterialCommunityIcons
                name="timetable"
                size={20}
                color={theme.colors.gray}
                style={{ marginRight: 2 }}
              />
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
                {dateCreated}
              </Text>
            </Block>
            <Block
              center
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
                {'\u20B9'} {cost}
              </Text>
            </Block>
          </Block>

          <Block row>

          <Block row center>
              <MaterialCommunityIcons
                name="cellphone-key"
                size={20}
                color={theme.colors.gray}
                style={{ marginRight: 2 }}
              />
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
               Verification code
              </Text>
            </Block>
            <Block
              center
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
                 {verificationCode}
              </Text>
            </Block>
          </Block>

          <Block
            style={{
              borderWidth: 0.5,
              borderColor: theme.colors.gray,
              marginVertical: 2,
            }}
          />
          <Block row center>
            <MaterialCommunityIcons
              name="human-greeting"
              size={16}
              color={theme.colors.gray}
              style={{ marginRight: 2 }}
            />
            <Text
              bold
              color={theme.colors.black}
              style={{ paddingHorizontal: 8, fontSize: 12 }}
            >
              {pickupInfo}
            </Text>
          </Block>
          <Block row>
            <Ionicons
              name="ios-ellipsis-vertical-sharp"
              size={16}
              color={theme.colors.gray}
            />
          </Block>
          <Block row center>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={theme.colors.gray}
              style={{ marginRight: 2, marginBottom: 2 }}
            />
            <Text
              bold
              color={theme.colors.black}
              style={{ paddingHorizontal: 8, fontSize: 12 }}
            >
              {destinationInfo}
            </Text>
          </Block>
          <Block row>
            <Block row center>
              <MaterialCommunityIcons
                name="star-circle"
                size={20}
                color={theme.colors.green}
                style={{ marginRight: 2 }}
              />
              <Text
                bold
                color={theme.colors.black}
                style={{ paddingHorizontal: 8, fontSize: 12 }}
              >
                 {
              rideStatus=="Cancelled"?
              "Not available"
              :
              riderRating==null?
               <TouchableOpacity
               activeOpacity={0.8}
               style={{
                 padding: 5,
                 borderWidth:1.5,
                 borderColor:theme.colors.yellow,
                 borderRadius: 20,
               }}
               onPress={()=>navigation.navigate("Rider Rating",{"rideHistoryId":rideHistoryId})}
             >
               <Text bold color={theme.colors.yellow}>
                Rate rider
               </Text>
             </TouchableOpacity>
                :
                riderRating}
               
              </Text>
            </Block>
            <Block
              center
              style={{
                alignItems: "flex-end",
              }}
            >
            {
              rideStatus=="Verified"?
              <TouchableOpacity
               activeOpacity={0.8}
               style={{
                 padding: 5,
                 borderWidth:1.5,
                 borderColor:theme.colors.green,
                 borderRadius: 20,
               }}
               onPress={()=>navigation.navigate("AppMap")}
             >
               <Text bold color={theme.colors.green}>
                 Request Again
               </Text>
             </TouchableOpacity>:
             <Block/>
            }
            </Block>
          </Block>
        </Block>
      </Block>
    );
  };
  return (
    <Block>
    <Block row style={{justifyContent: "center",
    top: StatusBar.currentHeight,
    marginTop: 10,
    alignItems: "center",position:'absolute', zIndex: 1,paddingHorizontal:15,}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor:
              mode === "All" ? theme.colors.yellow : theme.colors.white,
            paddingHorizontal: 20,
            paddingVertical: 15,
            marginRight: 5,
            borderRadius: 5,
          }}
          onPress={() => setMode("All")}
        >
          <Text
            bold
            color={mode === "All" ? theme.colors.white : theme.colors.black}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor:
              mode === "Verified" ? theme.colors.green : theme.colors.white,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginRight: 5,
              borderRadius: 5,
          }}
          onPress={() => filterverifiedData()}
        >
          <Text
            bold
            color={
              mode === "Verified" ? theme.colors.white : theme.colors.black
            }
          >
            Verified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor:
              mode === "Cancelled" ? theme.colors.red : theme.colors.white,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginRight: 5,
              borderRadius: 5,
          }}
          onPress={() => filterCancelledData()}
        >
          <Text
            bold
            color={
              mode === "Cancelled" ? theme.colors.white : theme.colors.black
            }
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </Block>
    
      

      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <Block style={{
        marginTop: 90,
     }}>
        <FlatList
          data={
            mode == "All"
              ? rideRequestData
              : mode == "Verified"
              ? verifiedData
              : cancelledData
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          ListEmptyComponent={() => <Empty title="rides" />}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.maroon]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={(post) => (
            <Item
              rider={post.item.rider==null?"Self":post.item.rider.fullName}
              verificationCode={post.item.verificationCode}
              rideHistoryId={post.item.id}
              dateCreated={post.item.created_at}
              cost={post.item.cost}
              rideStatus={post.item.rideStatus}
              riderRating={post.item.riderRating}
              pickupInfo={post.item.pickupInfo}
              destinationInfo={post.item.destinationInfo}
            />
            
          )}
        />
        </Block>

      )}
    </Block>
  );
};
