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

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['now-playing-movies', selectedRegion],
    queryFn: () => getNowPlayingMovies(selectedRegion),
    select: (response) => response.data.results.slice(0, 10),
  });

  const { data: tvs, isLoading: tvsLoading } = useQuery({
    queryKey: ['airing-today-tv', selectedRegion],
    queryFn: () => getAiringTodayTV(selectedRegion),
    select: (response) => response.data.results.slice(0, 10),
  });

  return {
    regions: REGIONS,
    selectedRegion,
    setSelectedRegion,
    currentRegion,
    movies: movies || [],
    tvs: tvs || [],
    isLoading: moviesLoading || tvsLoading,
  };
}

export type { Region };
