import React, { useEffect } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import axios from "axios";
import { useState } from "react";
import SinglePage from "../SinglePage/SinglePage";

const Movies = () => {
  const [content, setContent] = useState([]);

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=e3292ff8b2536cc8f84ed4244125f5b9`
    );
    setContent(data.results);
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <View>
      <Text>Movies</Text>
      <View>
        {content &&
          content.map((media) => {
            return;

            <SinglePage item={item} />;
          })}
      </View>
    </View>
  );
};

export default Movies;

/*


const Movies = () => {
  
  );
};

export default Movies*/
