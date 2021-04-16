import React, { useState, useEffect } from "react";
import {
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as theme from "../../constants/theme.js";
import eventDetail from "../../constants/eventDetail.js";
import { Block, EventCard, Text } from "../../components/Index.js";

export default EventDetail = ({ route }) => {
  const [eventDetailData, setEventDetailData] = useState(eventDetail);
  const filterData = () => {
    const { club } = route.params;
    const newData = eventDetailData.filter((item) => {
      return item.club === club;
    });
    setEventDetailData(newData);
  };
  useEffect(() => filterData(), []);

  const EmptyEvent = () => {
    return (
      <Block center middle>
        <Block style={{ marginTop: 20 }}>
          <Image
            source={require("../../assets/icons/box.png")}
            style={{ height: 100, width: 100 }}
          />
        </Block>
        <Text h3 color={theme.colors.gray} bold>
          No events available for now!
        </Text>
      </Block>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={eventDetailData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyEvent}
        
        
        renderItem={(post) => (
          <EventCard  title={post.item.title}
          dateCreated={post.item.dateCreated}
          location={post.item.location}
          eventDate={post.item.eventDate}
          club={post.item.club}
          description={post.item.description}  />
        )}
      />
    </SafeAreaView>
  );
};
