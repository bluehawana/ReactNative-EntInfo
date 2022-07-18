import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";

const PopMovies = () => {
  const [content, setContent] = useState([]);

  const fetchPop = async () => {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.React_App_Api"
    );
    console.log(data);
    setContent(data.results);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.results}>
        {state.results.map((result) => (
          <View key={result.id} style={styles.result}>
            <Image
              Poster={result.poster_path}
              style={{
                width: 300,
                height: 300,
              }}
              resizeMode="cover"
            />
            <Text style={styles.heading}>{result.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "#015E93",
      paddingTop: 75,
      paddingHorizontal: 25,
    },
    title: {
      color: "#FFF",
      fontSize: 28,
      fontWeight: "400",
      marginBottom: 560,
      textAlign: "center",
    },
    results: {
      flex: 1,
    },
    result: {
      flex: 1,
      width: "100%",
      marginBottom: 20,
    },
    heading: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "700",
      padding: 20,
      backgroundColor: "#445565",
    },
  });
};
export default PopMovies;
