import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, FlatList } from "react-native";
import * as theme from "../../constants/theme.js";
import { Card, Block, Empty } from "../../components/Index.js";
import { privacyPolicyUrl } from "../../constants/url.js";
import axios from "axios";

export default AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [aboutUsData, setAboutUsData] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getAboutUsData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: privacyPolicyUrl,
        });
        setAboutUsData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getAboutUsData();
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <FlatList
          data={aboutUsData}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <Empty title="about us" />}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          renderItem={(post) => (
            <Card
              title={post.item.title}
              description={post.item.description}
              color="#296073"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};
