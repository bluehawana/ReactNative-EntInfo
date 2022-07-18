import React, { useEffect } from "react";
import {StyleSheet, View,Text,Button} from 'react-native-web'
import axios from "axios";
import { useState } from "react";
import "../SinglePage/SinglePage";
import SinglePage from "../SinglePage/SinglePage";
import MovieItem from "../models/MovieItem";

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
    <Text>
      <div className="pageTitle">Movies</div>
      <div className="movies">
        {content &&
          content.map((media) => (
            <SinglePage
              key={media.id}
              id={media.id}
              poster={media.poster_path}
              title={media.title || media.name}
              date={media.first_air_date || media.release_date}
              media_type={media.media_type}
              vote_average={media.vote_average}
            />
          ))}
      </div>
    </Text>
  );
};

export default Movies;
