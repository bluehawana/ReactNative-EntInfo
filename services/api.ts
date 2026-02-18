import axios from 'axios';
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
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

// High-resolution image URLs for HD/1080p quality
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';       // 1280px for posters - Full HD quality
export const IMAGE_BASE_LARGE = 'https://image.tmdb.org/t/p/w1280';  // 1280px for backdrops - 720p/1080p HD
export const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original'; // Full resolution for hero images
export const PROFILE_BASE = 'https://image.tmdb.org/t/p/h632';        // 632px for cast photos - HD quality
export const PROVIDER_LOGO_BASE = 'https://image.tmdb.org/t/p/w300'; // 300px for provider logos

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

// Region detection from device locale
export function getDeviceRegion(): string {
  // Get device locale - supports both old and new expo-localization API
  const locales = Localization.getLocales();
  const locale = locales[0]?.languageTag || 'en-US';
  // Extract country code from locale (e.g., "en-US" -> "US", "zh-CN" -> "CN")
  const parts = locale.split('-');
  if (parts.length >= 2) {
    return parts[parts.length - 1].split('_')[0].toUpperCase();
  }
  return 'US';
}

// Popular regions for trending content
export const REGIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸', language: 'en-US' },
  { code: 'CN', name: 'China', flag: '🇨🇳', language: 'zh-CN' },
  { code: 'IN', name: 'India', flag: '🇮🇳', language: 'hi-IN' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', language: 'ja-JP' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', language: 'ko-KR' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'en-GB' },
  { code: 'FR', name: 'France', flag: '🇫🇷', language: 'fr-FR' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'de-DE' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', language: 'pt-BR' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', language: 'es-MX' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'es-ES' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', language: 'it-IT' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', language: 'en-AU' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', language: 'en-CA' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', language: 'sv-SE' },
];

export function getRegionInfo(code: string) {
  return REGIONS.find((r) => r.code === code) || REGIONS[0];
}

export const getTrending = (region?: string) =>
  tmdbApi.get<ApiResponse<TrendingItem>>('/trending/all/day', {
    params: { language: 'en-US', region },
  });

export const getPopularMovies = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<Movie>>('/movie/popular', {
    params: { language: regionInfo.language, page: 1, region },
  });
};

export const getNowPlayingMovies = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<Movie>>('/movie/now_playing', {
    params: { language: regionInfo.language, page: 1, region },
  });
};

export const getPopularTV = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<TVShow>>('/tv/popular', {
    params: { language: regionInfo.language, page: 1, region },
  });
};

export const getAiringTodayTV = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<TVShow>>('/tv/airing_today', {
    params: { language: regionInfo.language, page: 1, region },
  });
};

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

// Top rated movies and TV shows
export const getTopRatedMovies = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<Movie>>('/movie/top_rated', {
    params: { language: regionInfo.language, page: 1, region },
  });
};

export const getTopRatedTV = (region?: string) => {
  const regionInfo = getRegionInfo(region || 'US');
  return tmdbApi.get<ApiResponse<TVShow>>('/tv/top_rated', {
    params: { language: regionInfo.language, page: 1, region },
  });
};
