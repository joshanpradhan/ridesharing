import React from "react";
import Block from "./Block";
import Text from "./Text";
import * as theme from "../constants/theme.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default EventCard = ({
  club,
  eventDate,
  description,
  location,
  title,
  dateCreated,
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
          paddingVertical: 8,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.white,
          borderRadius: 5,
        }}
      >
        <Text bold h3 style={{ fontSize: 20 }} color={theme.colors.black}>
          {title}
        </Text>
        <Block row center style={{paddingVertical:2}}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={20}
            color={theme.colors.gray}
            style={{ marginRight: 5 }}
          />

          <Text h4 center color={theme.colors.black}>
            {eventDate}
          </Text>
        </Block>

        <Block row center style={{paddingVertical:2}}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={theme.colors.gray}
            style={{ marginRight: 5 }}
          />
          <Text h4 center color={theme.colors.black}>
            {location}
          </Text>
        </Block>

        <Block row center style={{paddingVertical:2}}>
          <MaterialCommunityIcons
            name="account-supervisor-circle"
            size={20}
            color={theme.colors.gray}
            style={{ marginRight: 5 }}
          />

          <Text h4 center color={theme.colors.black}>
            {club}
          </Text>
        </Block>
        <Block
          style={{
            borderWidth: 0.5,
            borderColor: theme.colors.white,
            marginVertical: 5,
          }}
        />

        <Text bold paragraph color={theme.colors.black}>{description}</Text>
        <Block
          center
          style={{
            alignItems: "flex-end",
          }}
        >
          <Text bold color={theme.colors.black} style={{fontSize:12}}>{dateCreated}</Text>
        </Block>
      </Block>
    </Block>
  );
};