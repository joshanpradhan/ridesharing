import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, FlatList } from "react-native";
import * as theme from "../../constants/theme.js";
import { Block, Empty,Card } from "../../components/Index.js";
import { privacyPolicyUrl } from "../../constants/url.js";
import axios from "axios";

export default Privacy = () => {
  const [loading, setLoading] = useState(true);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source()
    const getFaqData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: privacyPolicyUrl,
        });
        setFaqData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getFaqData()
    return () => {
        source.cancel()
    }
}, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Block center middle>
          <ActivityIndicator size="large" color={theme.colors.maroon} />
        </Block>
      ) : (
        <FlatList
          data={faqData}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <Empty title="privacy policy" />}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
        
          renderItem={(post) => (
            <Card title={post.item.title} description={post.item.description} color="#C34A36" />
          )}
        />
      )}
    </SafeAreaView>
  );
};
