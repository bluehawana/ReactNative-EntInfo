/**
 * API Service Tests
 * Tests all TMDB API functions for iOS and Android compatibility
 */

import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  tmdbApi,
  getTrending,
  getPopularMovies,
  getNowPlayingMovies,
  getPopularTV,
  getAiringTodayTV,
  searchMovies,
  searchMulti,
  discoverTV,
  getMovieDetails,
  getTVDetails,
  getMovieCredits,
  getTVCredits,
  getMovieWatchProviders,
  getTVWatchProviders,
  getTopRatedMovies,
  getTopRatedTV,
  getDeviceRegion,
  getRegionInfo,
  REGIONS,
  IMAGE_BASE,
  IMAGE_BASE_LARGE,
  IMAGE_ORIGINAL,
  PROFILE_BASE,
} from './api';

const axiosMock = new MockAdapter(axios);

describe('API Service', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  describe('API Configuration', () => {
    it('should have correct image base URLs for HD quality', () => {
      expect(IMAGE_BASE).toBe('https://image.tmdb.org/t/p/w1280');       // Posters: 1280px Full HD
      expect(IMAGE_BASE_LARGE).toBe('https://image.tmdb.org/t/p/w1280'); // Backdrops: 1280px (720p/1080p HD)
      expect(IMAGE_ORIGINAL).toBe('https://image.tmdb.org/t/p/original'); // Full resolution for hero images
      expect(PROFILE_BASE).toBe('https://image.tmdb.org/t/p/h632');       // Cast photos: 632px height HD
    });
  });

  describe('getDeviceRegion', () => {
    it('should return US as default region', () => {
      const region = getDeviceRegion();
      expect(region).toBe('US');
    });
  });

  describe('getRegionInfo', () => {
    it('should return correct info for United States', () => {
      const region = getRegionInfo('US');
      expect(region.code).toBe('US');
      expect(region.name).toBe('United States');
      expect(region.flag).toBe('🇺🇸');
      expect(region.language).toBe('en-US');
    });

    it('should return correct info for China', () => {
      const region = getRegionInfo('CN');
      expect(region.code).toBe('CN');
      expect(region.name).toBe('China');
      expect(region.flag).toBe('🇨🇳');
      expect(region.language).toBe('zh-CN');
    });

    it('should return correct info for India', () => {
      const region = getRegionInfo('IN');
      expect(region.code).toBe('IN');
      expect(region.name).toBe('India');
      expect(region.flag).toBe('🇮🇳');
      expect(region.language).toBe('hi-IN');
    });

    it('should return correct info for Japan', () => {
      const region = getRegionInfo('JP');
      expect(region.code).toBe('JP');
      expect(region.name).toBe('Japan');
      expect(region.flag).toBe('🇯🇵');
      expect(region.language).toBe('ja-JP');
    });

    it('should return correct info for South Korea', () => {
      const region = getRegionInfo('KR');
      expect(region.code).toBe('KR');
      expect(region.name).toBe('South Korea');
      expect(region.flag).toBe('🇰🇷');
      expect(region.language).toBe('ko-KR');
    });

    it('should return correct info for United Kingdom', () => {
      const region = getRegionInfo('GB');
      expect(region.code).toBe('GB');
      expect(region.name).toBe('United Kingdom');
      expect(region.flag).toBe('🇬🇧');
      expect(region.language).toBe('en-GB');
    });

    it('should return correct info for France', () => {
      const region = getRegionInfo('FR');
      expect(region.code).toBe('FR');
      expect(region.name).toBe('France');
      expect(region.flag).toBe('🇫🇷');
      expect(region.language).toBe('fr-FR');
    });

    it('should return correct info for Germany', () => {
      const region = getRegionInfo('DE');
      expect(region.code).toBe('DE');
      expect(region.name).toBe('Germany');
      expect(region.flag).toBe('🇩🇪');
      expect(region.language).toBe('de-DE');
    });

    it('should return correct info for Brazil', () => {
      const region = getRegionInfo('BR');
      expect(region.code).toBe('BR');
      expect(region.name).toBe('Brazil');
      expect(region.flag).toBe('🇧🇷');
      expect(region.language).toBe('pt-BR');
    });

    it('should return correct info for Mexico', () => {
      const region = getRegionInfo('MX');
      expect(region.code).toBe('MX');
      expect(region.name).toBe('Mexico');
      expect(region.flag).toBe('🇲🇽');
      expect(region.language).toBe('es-MX');
    });

    it('should return correct info for Spain', () => {
      const region = getRegionInfo('ES');
      expect(region.code).toBe('ES');
      expect(region.name).toBe('Spain');
      expect(region.flag).toBe('🇪🇸');
      expect(region.language).toBe('es-ES');
    });

    it('should return correct info for Italy', () => {
      const region = getRegionInfo('IT');
      expect(region.code).toBe('IT');
      expect(region.name).toBe('Italy');
      expect(region.flag).toBe('🇮🇹');
      expect(region.language).toBe('it-IT');
    });

    it('should return correct info for Australia', () => {
      const region = getRegionInfo('AU');
      expect(region.code).toBe('AU');
      expect(region.name).toBe('Australia');
      expect(region.flag).toBe('🇦🇺');
      expect(region.language).toBe('en-AU');
    });

    it('should return correct info for Canada', () => {
      const region = getRegionInfo('CA');
      expect(region.code).toBe('CA');
      expect(region.name).toBe('Canada');
      expect(region.flag).toBe('🇨🇦');
      expect(region.language).toBe('en-CA');
    });

    it('should return correct info for Sweden', () => {
      const region = getRegionInfo('SE');
      expect(region.code).toBe('SE');
      expect(region.name).toBe('Sweden');
      expect(region.flag).toBe('🇸🇪');
      expect(region.language).toBe('sv-SE');
    });

    it('should return US as fallback for unknown region', () => {
      const region = getRegionInfo('UNKNOWN');
      expect(region.code).toBe('US');
    });
  });

  describe('REGIONS array', () => {
    it('should contain all 15 major regions', () => {
      expect(REGIONS).toHaveLength(15);
    });

    it('should have all required fields for each region', () => {
      REGIONS.forEach((region) => {
        expect(region).toHaveProperty('code');
        expect(region).toHaveProperty('name');
        expect(region).toHaveProperty('flag');
        expect(region).toHaveProperty('language');
        expect(typeof region.code).toBe('string');
        expect(typeof region.name).toBe('string');
        expect(typeof region.flag).toBe('string');
        expect(typeof region.language).toBe('string');
      });
    });

    it('should contain US, CN, IN, JP, KR regions', () => {
      const codes = REGIONS.map(r => r.code);
      expect(codes).toContain('US');
      expect(codes).toContain('CN');
      expect(codes).toContain('IN');
      expect(codes).toContain('JP');
      expect(codes).toContain('KR');
    });
  });

  describe('getTrending', () => {
    it('should fetch trending content', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Trending Movie', media_type: 'movie' },
          { id: 2, name: 'Trending TV', media_type: 'tv' },
        ],
      };
      axiosMock.onGet('/trending/all/day').reply(200, mockData);

      const response = await getTrending();
      expect(response.data.results).toHaveLength(2);
      expect(response.data.results[0].id).toBe(1);
    });

    it('should pass region parameter when provided', async () => {
      axiosMock.onGet('/trending/all/day').reply(200, { results: [] });

      await getTrending('US');

      const request = axiosMock.history.get[0];
      expect(request.params?.region).toBe('US');
    });
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Popular Movie 1' },
          { id: 2, title: 'Popular Movie 2' },
        ],
      };
      axiosMock.onGet('/movie/popular').reply(200, mockData);

      const response = await getPopularMovies('US');
      expect(response.data.results).toHaveLength(2);
    });

    it('should use correct language for region', async () => {
      axiosMock.onGet('/movie/popular').reply(200, { results: [] });

      await getPopularMovies('JP');

      const request = axiosMock.history.get[0];
      expect(request.params?.language).toBe('ja-JP');
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should fetch now playing movies', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Now Playing Movie' },
        ],
      };
      axiosMock.onGet('/movie/now_playing').reply(200, mockData);

      const response = await getNowPlayingMovies('US');
      expect(response.data.results).toHaveLength(1);
    });

    it('should pass region parameter', async () => {
      axiosMock.onGet('/movie/now_playing').reply(200, { results: [] });

      await getNowPlayingMovies('GB');

      const request = axiosMock.history.get[0];
      expect(request.params?.region).toBe('GB');
    });
  });

  describe('getPopularTV', () => {
    it('should fetch popular TV shows', async () => {
      const mockData = {
        results: [
          { id: 1, name: 'Popular TV Show' },
        ],
      };
      axiosMock.onGet('/tv/popular').reply(200, mockData);

      const response = await getPopularTV('US');
      expect(response.data.results).toHaveLength(1);
    });
  });

  describe('getAiringTodayTV', () => {
    it('should fetch airing today TV shows', async () => {
      const mockData = {
        results: [
          { id: 1, name: 'Airing Today Show' },
        ],
      };
      axiosMock.onGet('/tv/airing_today').reply(200, mockData);

      const response = await getAiringTodayTV('US');
      expect(response.data.results).toHaveLength(1);
    });
  });

  describe('searchMovies', () => {
    it('should search movies with query', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Inception' },
        ],
      };
      axiosMock.onGet('/search/movie').reply(200, mockData);

      const response = await searchMovies('Inception');
      expect(response.data.results).toHaveLength(1);
    });

    it('should handle empty search results', async () => {
      axiosMock.onGet('/search/movie').reply(200, { results: [] });

      const response = await searchMovies('nonexistent movie');
      expect(response.data.results).toHaveLength(0);
    });
  });

  describe('searchMulti', () => {
    it('should search across movies and TV', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Movie Result', media_type: 'movie' },
          { id: 2, name: 'TV Result', media_type: 'tv' },
        ],
      };
      axiosMock.onGet('/search/multi').reply(200, mockData);

      const response = await searchMulti('test');
      expect(response.data.results).toHaveLength(2);
    });
  });

  describe('discoverTV', () => {
    it('should discover TV shows', async () => {
      const mockData = {
        results: [
          { id: 1, name: 'Discovered Show' },
        ],
      };
      axiosMock.onGet('/discover/tv').reply(200, mockData);

      const response = await discoverTV();
      expect(response.data.results).toHaveLength(1);
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details by ID', async () => {
      const mockData = {
        id: 550,
        title: 'Fight Club',
        overview: 'A depressed man...',
        vote_average: 8.4,
      };
      axiosMock.onGet('/movie/550').reply(200, mockData);

      const response = await getMovieDetails(550);
      expect(response.data.title).toBe('Fight Club');
      expect(response.data.id).toBe(550);
    });

    it('should handle 404 for non-existent movie', async () => {
      axiosMock.onGet('/movie/999999').reply(404);

      await expect(getMovieDetails(999999)).rejects.toThrow();
    });
  });

  describe('getTVDetails', () => {
    it('should fetch TV show details by ID', async () => {
      const mockData = {
        id: 1396,
        name: 'Breaking Bad',
        overview: 'A high school chemistry teacher...',
        vote_average: 8.9,
      };
      axiosMock.onGet('/tv/1396').reply(200, mockData);

      const response = await getTVDetails(1396);
      expect(response.data.name).toBe('Breaking Bad');
      expect(response.data.id).toBe(1396);
    });

    it('should handle 404 for non-existent TV show', async () => {
      axiosMock.onGet('/tv/999999').reply(404);

      await expect(getTVDetails(999999)).rejects.toThrow();
    });
  });

  describe('getMovieCredits', () => {
    it('should fetch movie cast and crew', async () => {
      const mockData = {
        cast: [
          { id: 1, name: 'Actor 1', character: 'Character 1' },
          { id: 2, name: 'Actor 2', character: 'Character 2' },
        ],
        crew: [
          { id: 3, name: 'Director', job: 'Director' },
        ],
      };
      axiosMock.onGet('/movie/550/credits').reply(200, mockData);

      const response = await getMovieCredits(550);
      expect(response.data.cast).toHaveLength(2);
      expect(response.data.crew).toHaveLength(1);
    });
  });

  describe('getTVCredits', () => {
    it('should fetch TV show cast and crew', async () => {
      const mockData = {
        cast: [
          { id: 1, name: 'Actor 1', character: 'Character 1' },
        ],
        crew: [],
      };
      axiosMock.onGet('/tv/1396/credits').reply(200, mockData);

      const response = await getTVCredits(1396);
      expect(response.data.cast).toHaveLength(1);
    });
  });

  describe('getMovieWatchProviders', () => {
    it('should fetch movie streaming providers', async () => {
      const mockData = {
        results: {
          US: {
            flatrate: [
              { provider_id: 8, provider_name: 'Netflix' },
            ],
          },
        },
      };
      axiosMock.onGet('/movie/550/watch/providers').reply(200, mockData);

      const response = await getMovieWatchProviders(550);
      expect(response.data.results.US).toBeDefined();
    });

    it('should handle movies with no providers', async () => {
      axiosMock.onGet('/movie/123/watch/providers').reply(200, { results: {} });

      const response = await getMovieWatchProviders(123);
      expect(response.data.results).toEqual({});
    });
  });

  describe('getTVWatchProviders', () => {
    it('should fetch TV show streaming providers', async () => {
      const mockData = {
        results: {
          US: {
            flatrate: [
              { provider_id: 8, provider_name: 'Netflix' },
            ],
          },
        },
      };
      axiosMock.onGet('/tv/1396/watch/providers').reply(200, mockData);

      const response = await getTVWatchProviders(1396);
      expect(response.data.results.US).toBeDefined();
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Top Movie', vote_average: 9.0 },
        ],
      };
      axiosMock.onGet('/movie/top_rated').reply(200, mockData);

      const response = await getTopRatedMovies('US');
      expect(response.data.results).toHaveLength(1);
    });

    it('should use correct language for region', async () => {
      axiosMock.onGet('/movie/top_rated').reply(200, { results: [] });

      await getTopRatedMovies('FR');

      const request = axiosMock.history.get[0];
      expect(request.params?.language).toBe('fr-FR');
    });
  });

  describe('getTopRatedTV', () => {
    it('should fetch top rated TV shows', async () => {
      const mockData = {
        results: [
          { id: 1, name: 'Top TV Show', vote_average: 9.5 },
        ],
      };
      axiosMock.onGet('/tv/top_rated').reply(200, mockData);

      const response = await getTopRatedTV('US');
      expect(response.data.results).toHaveLength(1);
    });

    it('should use correct language for region', async () => {
      axiosMock.onGet('/tv/top_rated').reply(200, { results: [] });

      await getTopRatedTV('DE');

      const request = axiosMock.history.get[0];
      expect(request.params?.language).toBe('de-DE');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      axiosMock.onGet('/movie/550').networkError();

      await expect(getMovieDetails(550)).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      axiosMock.onGet('/movie/550').timeout();

      await expect(getMovieDetails(550)).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      axiosMock.onGet('/movie/550').reply(401);

      await expect(getMovieDetails(550)).rejects.toThrow();
    });

    it('should handle 500 server error', async () => {
      axiosMock.onGet('/movie/550').reply(500);

      await expect(getMovieDetails(550)).rejects.toThrow();
    });
  });
});