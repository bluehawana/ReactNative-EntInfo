import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

function SinglePage(props) {
  return (
    <View style={styles.item}>
      <Image
        style={styles.poster}
        source={{
          uri: "http://image.tmdb.org/t/p/w342/" + props.media.poster_path,
        }}
      />
      <Text>{props.media.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  poster: {
    width: 342,
    height: 513,
  },
});

export default SinglePage;
