export default class Movie {
  constructor({
    id,
    title,
    poster_path,
    backdrop_path,
    genres,
    genre_ids,
    overview,
    popularity,
    release_date,
    vote_average,
    vote_count,
  }) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.backdrop_path = backdrop_path;
    this.genres = genres;
    this.genre_ids = genre_ids;
    this.overview = overview;
    this.popularity = popularity;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
  }
}
