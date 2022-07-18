import React from "react";
import { img_300 } from "../../.expo/config";

const SinglePage = ({ id, poster, title, date, media_type, vote_average }) => {
  return (
    <div className="single-page">
      <img src={"https://image.tmdb.org/t/p/w342/" + poster} alt=""></img>
    </div>
  );
};

export default SinglePage;
