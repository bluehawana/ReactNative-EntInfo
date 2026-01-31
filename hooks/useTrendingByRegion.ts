import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNowPlayingMovies, getAiringTodayTV, getDeviceRegion, REGIONS, getRegionInfo } from '../services/api';

interface Region {
  code: string;
  name: string;
  flag: string;
  language: string;
}

export function useTrendingByRegion(initialRegion?: string) {
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    return initialRegion || getDeviceRegion();
  });

  const currentRegion = getRegionInfo(selectedRegion);

  const moviesQuery = useQuery({
    queryKey: ['now-playing-movies', selectedRegion],
    queryFn: () => getNowPlayingMovies(selectedRegion),
    select: (response) => response.data.results.slice(0, 10),
  });

  const tvsQuery = useQuery({
    queryKey: ['airing-today-tv', selectedRegion],
    queryFn: () => getAiringTodayTV(selectedRegion),
    select: (response) => response.data.results.slice(0, 10),
  });

  return {
    regions: REGIONS,
    selectedRegion,
    setSelectedRegion,
    currentRegion,
    movies: moviesQuery.data || [],
    tvs: tvsQuery.data || [],
    isLoading: moviesQuery.isLoading || tvsQuery.isLoading,
    error: moviesQuery.error || tvsQuery.error,
    refetch: () => {
      moviesQuery.refetch();
      tvsQuery.refetch();
    },
  };
}

export type { Region };
