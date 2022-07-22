import React, { useEffect } from "react";
import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import axios from "axios";
import { useState } from "react";
import SinglePage from "../SinglePage/SinglePage";

const Movies = () => {
  const [content, setContent] = useState([]);

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=e3292ff8b2536cc8f84ed4244125f5b9&language=en-US&page=1`
    );
    setContent(data.results);
  };
  useEffect(() => {
    fetchMovies();
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

export default Movies;

/*


const Movies = () => {
  
  );
};

export default Movies*/
