import React from "react";
import { View, Text, Image } from "react-native-web";

const SinglePage = ({
  id,
  poster,
  title,
  date,
  media_type,
  vote_average,
  poster_path,
}) => {
  return (
    <View>
      <Image
        source={{
          uri: "https://image.tmdb.org/t/p/w342/ " + media.poster.poster_path,
        }}
        alt=""
      ></Image>
    </View>
  );
};

export default SinglePage;
