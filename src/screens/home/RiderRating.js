import React, { useState, useEffect } from "react";
import { StyleSheet, Image,ActivityIndicator } from "react-native";
import { Rating } from "react-native-ratings";
import { Block, Text } from "../../components/Index.js";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { rideHistoryUrl } from "../../constants/url.js";
import * as theme from "../../constants/theme.js";

export default RiderRating = ({navigation,route}) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(3);

  const onFinishRating=(rate)=>{
      setRating(rate);
    }
  const onSubmitRating = async () => {
    try {
      await axios({
        method: "PUT",
        url: `${rideHistoryUrl}/${route.params.rideHistoryId}`,
        data: {
          riderRating: rating,
        },
      }).then(async (response) => {
        showMessage({
          message: "Your ratings helps us to improve your ride experience",
          type: "success",
        });
        setLoading(false);
      });
      navigation.navigate("Home");
    } catch (error) {
      showMessage({
        message: "Sorry, we could not proceed your request. Try again!",
        type: "danger",
      });
      navigation.navigate("Home");
      setLoading(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <Block center middle>
      <Block center style={{ marginTop: 20, padding: 20 }}>
        <Text h2>Rate your rider</Text>
        <Text style={{ fontSize: 20 }}>
          Your rating helps rider and us to improve the user experience
        </Text>
      </Block>
      <Block center>
        <Image
          source={require("../../assets/icons/helmet.png")}
          style={{ height: 100, width: 100 }}
        />
      </Block>
      <Block>
        <Rating
          type="star"
          ratingColor={theme.colors.green}
          ratingBackgroundColor={theme.colors.white}
          ratingCount={5}
          imageSize={30}
          showRating
          onFinishRating={(rate)=>onFinishRating(rate)}
        />
      </Block>
      <Block>
        <Button
          full
          style={{
            marginBottom: 12,
          }}
          onPress={()=>{
            setLoading(!loading);
            onSubmitRating();
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text button>Submit</Text>
          )}
        </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  /******** card **************/
});
