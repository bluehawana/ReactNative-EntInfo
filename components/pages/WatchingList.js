import React, { useEffect } from "react";
import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import axios from "axios";
import { useState } from "react";
import SinglePage from "../SinglePage/SinglePage";

const Watchinglist = () => {
  const [content, setContent] = useState([]);

  const fetchWatchingList = async () => {
    const { data } = await axios.get(
      `
https://api.themoviedb.org/3/discover/tv?api_key=e3292ff8b2536cc8f84ed4244125f5b9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
    );
    setContent(data.results);
  };
  useEffect(() => {
    fetchWatchingList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {content &&
        content.map((media) => {
          return <SinglePage key={media.id} media={media} />;
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Watchinglist;

/*


const Movies = () => {
  
  );
};

export default Movies*/
