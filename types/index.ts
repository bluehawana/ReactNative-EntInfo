export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  first_air_date: string;
}

export interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

export type MediaItem = Movie | TVShow | TrendingItem;

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderData {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  results: {
    [countryCode: string]: WatchProviderData;
  };
}

export interface ExternalIds {
  imdb_id?: string | null;
  tvdb_id?: number | null;
  wikidata_id?: string | null;
}

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
  external_ids?: ExternalIds;
}

export interface TVDetails {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  first_air_date: string;
  episode_run_time: number[];
  genres: Genre[];
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  external_ids?: ExternalIds;
}
