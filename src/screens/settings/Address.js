import React, { useState, useEffect, useContext } from "react";
import {
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import * as theme from "../../constants/theme.js";
import { Block, Text, Empty, Button } from "../../components/Index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { savedAddressUrl } from "../../constants/url.js";
import axios from "axios";
import { UserContext } from "../../context/UserContext.js";

export default Address = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedAddressData, setSavedAddressData] = useState();
  const context = useContext(UserContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getSavedAddressData();
    setRefreshing(false);
  });

  const handleRemove = (id) => {
    Alert.alert("Remove", "Are you sure you want to remove this address", [
      { text: "Yes", onPress: () => console.log("Removed") },
      { text: "No" },
    ]);
  };

  const removeAddressData = async (id) => {
    try {
      await axios({
        method: "DELETE",
        url: `${savedAddressUrl}/${id}`,
      }).then(function (response) {
        setSavedAddressData(response.data);
        setLoading(false);
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
    getSavedAddressData();
    return () => {
      source.cancel();
    };
  }, []);

  const Item = ({ id, title, description, icon }) => {
    return (
      <Block
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          backgroundColor: theme.colors.white,
        }}
      >
        <Block
          row
          center
          style={{
            justifyContent: "space-between",
            backgroundColor: theme.colors.gray2,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color="black"
            style={{ marginRight: 5 }}
          />
          <Block
            row
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}
          >
            <Block>
              <Text h4>{title}</Text>
              <Text h4>{description}</Text>
            </Block>
            <Block row style={{ justifyContent: "flex-end" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleRemove(id);
                }}
              >
                <Block
                  middle
                  style={{
                    backgroundColor: theme.colors.red,
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text h4 color={theme.colors.white}>
                    Remove
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
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
            data={savedAddressData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            ListFooterComponent={
              <Block style={{ paddingHorizontal: 15 }}>
                <Button
                  style={{
                    marginBottom: 12,
                    backgroundColor: theme.colors.maroon,
                  }}
                  onPress={() => navigation.navigate("AddAddressMap")}
                >
                  <Text button>Add address</Text>
                </Button>
              </Block>
            }
            ListEmptyComponent={() => <Empty title="saved address" />}
            refreshControl={
              <RefreshControl
                colors={[theme.colors.maroon]}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            renderItem={(post) => (
              <Item
                id={post.item.id}
                title={post.item.title}
                description={post.item.description}
                icon={post.item.icon}
              />
            )}
          />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /******** card **************/
  separator: {},
});
