import React, { useEffect } from "react";
import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import axios from "axios";
import { useState } from "react";
import SinglePage from "../SinglePage/SinglePage";

const Search = () => {
  const [content, setContent] = useState([]);

  const fetchSearch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=e3292ff8b2536cc8f84ed4244125f5b9&query=batman`
    );
    setContent(data.results);
  };
  useEffect(() => {
    fetchSearch();
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

export default Search;

/*


const Movies = () => {
  
  );
};

export default Movies*/
