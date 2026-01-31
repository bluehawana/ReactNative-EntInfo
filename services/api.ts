import axios from 'axios';
import Constants from 'expo-constants';
import {
  Movie,
  TVShow,
  TrendingItem,
  ApiResponse,
  MovieDetails,
  TVDetails,
  Credits,
  WatchProvidersResponse,
} from '../types';

const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey as string;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';
export const IMAGE_BASE_LARGE = 'https://image.tmdb.org/t/p/w780';
export const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const getTrending = () =>
  tmdbApi.get<ApiResponse<TrendingItem>>('/trending/all/day');

export const getPopularMovies = () =>
  tmdbApi.get<ApiResponse<Movie>>('/movie/popular', {
    params: { language: 'en-US', page: 1 },
  });

export const getPopularTV = () =>
  tmdbApi.get<ApiResponse<TVShow>>('/tv/popular', {
    params: { language: 'en-US', page: 1 },
  });

export const searchMovies = (query: string) =>
  tmdbApi.get<ApiResponse<Movie>>('/search/movie', {
    params: { query },
  });

export const searchMulti = (query: string) =>
  tmdbApi.get<ApiResponse<TrendingItem>>('/search/multi', {
    params: { query },
  });

export const discoverTV = () =>
  tmdbApi.get<ApiResponse<TVShow>>('/discover/tv', {
    params: {
      language: 'en-US',
      sort_by: 'popularity.desc',
      include_adult: false,
      page: 1,
      with_watch_monetization_types: 'flatrate',
    },
  });

export const getMovieDetails = (id: number) =>
  tmdbApi.get<MovieDetails>(`/movie/${id}`, {
    params: { language: 'en-US' },
  });

export const getTVDetails = (id: number) =>
  tmdbApi.get<TVDetails>(`/tv/${id}`, {
    params: { language: 'en-US' },
  });

export const getMovieCredits = (id: number) =>
  tmdbApi.get<Credits>(`/movie/${id}/credits`, {
    params: { language: 'en-US' },
  });

export const getTVCredits = (id: number) =>
  tmdbApi.get<Credits>(`/tv/${id}/credits`, {
    params: { language: 'en-US' },
  });

export const getMovieWatchProviders = (id: number) =>
  tmdbApi.get<WatchProvidersResponse>(`/movie/${id}/watch/providers`);

export const getTVWatchProviders = (id: number) =>
  tmdbApi.get<WatchProvidersResponse>(`/tv/${id}/watch/providers`);
