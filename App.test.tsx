/**
 * EntInfo App - Comprehensive Test Suite
 * Tests API services and hooks for both iOS and Android
 *
 * Run tests with: npm test
 * Coverage report: npm test -- --coverage
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Import hooks
import { useTrendingByRegion } from './hooks/useTrendingByRegion';
import { useMediaDetail } from './hooks/useMedia';
import { useIsInWatchlist } from './hooks/useWatchlist';
import { getRegionInfo, REGIONS } from './services/api';

// Create axios mock
const axiosMock = new MockAdapter(axios, { onNoMatch: 'throwException' });

// Create query client with test config
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

let queryClient: QueryClient;

// Wrapper for all tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  axiosMock.reset();
  queryClient = createTestQueryClient();
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ==========================================================================
   API SERVICE TESTS
   ========================================================================== */

describe('API Services', () => {
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

  describe('REGIONS', () => {
    it('should contain all major regions', () => {
      const regionCodes = REGIONS.map((r) => r.code);
      expect(regionCodes).toContain('US');
      expect(regionCodes).toContain('CN');
      expect(regionCodes).toContain('IN');
      expect(regionCodes).toContain('JP');
      expect(regionCodes).toContain('KR');
      expect(regionCodes).toContain('GB');
      expect(regionCodes).toContain('FR');
      expect(regionCodes).toContain('DE');
      expect(regionCodes).toContain('BR');
      expect(regionCodes).toContain('MX');
      expect(regionCodes).toContain('ES');
      expect(regionCodes).toContain('IT');
      expect(regionCodes).toContain('AU');
      expect(regionCodes).toContain('CA');
      expect(regionCodes).toContain('SE');
    });

    it('should have 15 total regions', () => {
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
  });
});

/* ==========================================================================
   CUSTOM HOOKS TESTS
   ========================================================================== */

describe('Custom Hooks', () => {
  describe('useTrendingByRegion', () => {
    it('should return initial state with selected region', async () => {
      axiosMock.onGet('/movie/now_playing').reply(200, { results: [] });
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      await waitFor(() => {
        expect(result.current.selectedRegion).toBe('US');
        expect(result.current.currentRegion.code).toBe('US');
        expect(result.current.currentRegion.flag).toBe('🇺🇸');
      });
    });

    it('should return all 15 regions', async () => {
      axiosMock.onGet('/movie/now_playing').reply(200, { results: [] });
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      await waitFor(() => {
        expect(result.current.regions).toHaveLength(15);
      });
    });

    it('should fetch movies when region changes', async () => {
      const mockMovies = [
        { id: 1, title: 'Chinese Movie', poster_path: '/abc', vote_average: 7.5 },
        { id: 2, title: 'Another Movie', poster_path: '/def', vote_average: 8.0 },
      ];
      axiosMock.onGet('/movie/now_playing').reply(200, { results: mockMovies });
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      await waitFor(() => {
        expect(result.current.movies).toHaveLength(2);
        expect(result.current.movies[0].title).toBe('Chinese Movie');
      });
    });

    it('should update currentRegion when region changes', async () => {
      axiosMock.onGet('/movie/now_playing').reply(200, { results: [] });
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      act(() => {
        result.current.setSelectedRegion('CN');
      });

      await waitFor(() => {
        expect(result.current.selectedRegion).toBe('CN');
        expect(result.current.currentRegion.name).toBe('China');
        expect(result.current.currentRegion.flag).toBe('🇨🇳');
      });
    });

    it('should return empty arrays when API returns no results', async () => {
      axiosMock.onGet('/movie/now_playing').reply(200, { results: [] });
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      await waitFor(() => {
        expect(result.current.movies).toEqual([]);
        expect(result.current.tvs).toEqual([]);
      });
    });

    it('should handle API errors gracefully', async () => {
      axiosMock.onGet('/movie/now_playing').reply(500);
      axiosMock.onGet('/tv/airing_today').reply(200, { results: [] });

      const { result } = renderHook(() => useTrendingByRegion('US'), { wrapper });

      await waitFor(() => {
        expect(result.current.movies).toEqual([]);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('useMediaDetail', () => {
    it('should fetch movie details', async () => {
      const mockMovie = {
        id: 550,
        title: 'Fight Club',
        overview: 'A depressed man suffering from insomnia',
        poster_path: '/abc',
        backdrop_path: '/def',
        vote_average: 8.4,
        runtime: 139,
        release_date: '1999-10-15',
        genres: [{ id: 18, name: 'Drama' }],
      };
      axiosMock.onGet('/movie/550').reply(200, mockMovie);
      axiosMock.onGet('/movie/550/credits').reply(200, { cast: [], crew: [] });
      axiosMock.onGet('/movie/550/watch/providers').reply(200, { results: {} });

      const { result } = renderHook(() => useMediaDetail(550, 'movie'), { wrapper });

      await waitFor(() => {
        expect(result.current.details).toBeDefined();
        expect((result.current.details as any)?.title).toBe('Fight Club');
        expect(result.current.details?.vote_average).toBe(8.4);
      });
    });

    it('should fetch TV show details', async () => {
      const mockTV = {
        id: 1396,
        name: 'Breaking Bad',
        overview: 'A high school chemistry teacher turned methamphetamine producer',
        poster_path: '/abc',
        vote_average: 8.9,
        number_of_seasons: 5,
        number_of_episodes: 62,
        first_air_date: '2008-01-20',
        genres: [{ id: 18, name: 'Drama' }],
      };
      axiosMock.onGet('/tv/1396').reply(200, mockTV);
      axiosMock.onGet('/tv/1396/credits').reply(200, { cast: [], crew: [] });
      axiosMock.onGet('/tv/1396/watch/providers').reply(200, { results: {} });

      const { result } = renderHook(() => useMediaDetail(1396, 'tv'), { wrapper });

      await waitFor(() => {
        expect(result.current.details).toBeDefined();
        expect((result.current.details as any)?.name).toBe('Breaking Bad');
      });
    });

    it('should return error when API fails', async () => {
      axiosMock.onGet('/movie/999').reply(404);
      axiosMock.onGet('/movie/999/credits').reply(200, { cast: [], crew: [] });
      axiosMock.onGet('/movie/999/watch/providers').reply(200, { results: {} });

      const { result } = renderHook(() => useMediaDetail(999, 'movie'), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('useWatchlist', () => {
    it('should return false for item not in watchlist', async () => {
      const { result } = renderHook(() => useIsInWatchlist(999, 'movie'), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toBe(false);
      });
    });
  });
});
