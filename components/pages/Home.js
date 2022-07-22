import React, { useEffect } from "react";
import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import axios from "axios";
import { useState } from "react";
import SinglePage from "../SinglePage/SinglePage";

const Home = () => {
  const [content, setContent] = useState([]);

  const fetchHome = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=e3292ff8b2536cc8f84ed4244125f5b9`
    );
    setContent(data.results);
  };
  useEffect(() => {
    fetchHome();
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

export default Home;

/*


const Movies = () => {
  
  );
};

export default Movies*/
