import React, { useState, useEffect } from "react";
import {
  RefreshControl,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as theme from "../../constants/theme.js";
import { Block, Text, Empty } from "../../components/Index.js";
import { Entypo } from "@expo/vector-icons";
import { notificationsUrl } from "../../constants/url.js";
import axios from "axios";

export default Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationData, setNotificationData] = useState();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotificationData();
    setRefreshing(false);
  });

  const getNotificationData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: notificationsUrl,
      });
      setNotificationData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getNotificationData();
    return () => {
      source.cancel();
    };
  }, []);

  const Item = ({ description, dateCreated }) => {
    return (
      <Block
        style={{
          paddingHorizontal: 15,
          marginTop:10,
        }}
      >
        <Block style={{ backgroundColor:theme.colors.white, borderRadius: 10,}}>
        <Block
          row
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            justifyContent: "space-between",
          }}
        >
          <Entypo name="megaphone" color={theme.colors.maroon} size={28} />
          <Block>
            <Text bold paragraph>
              {description}
            </Text>
          </Block>
        </Block>
        <Block
          row
          style={{
            paddingVertical: 5,
            paddingHorizontal: 20,
            justifyContent: "flex-end",
          }}
        >
          <Text bold>{dateCreated}</Text>
        </Block>
        </Block>
      </Block>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <FlatList
          data={notificationData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          ListEmptyComponent={() => <Empty title="notifications" />}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.maroon]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={(post) => (
            <Item
              description={post.item.description}
              dateCreated={post.item.published_at}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};
