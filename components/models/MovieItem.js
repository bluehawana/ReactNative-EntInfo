import React from "react";
import { View, Text, StyleSheet } from "react-native";

function MovieItem(props) {
  return (
    <View style={style.item}>
      <Image
      style={styles.poster}
        source={{ uri: "http://image.tmdb.org/t/p/w342" + props.item.poster_path }}
      />
      <Text> {props.item.title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  poster: {
    width: 340,
    height: 510,
  },
});
export default MovieItem;
