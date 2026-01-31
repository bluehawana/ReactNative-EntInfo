import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'EntInfo',
  slug: 'EntInfo',
  extra: {
    tmdbApiKey: process.env.TMDB_API_KEY,
  },
});
