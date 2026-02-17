import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '2watch',
  slug: '2watch',
  extra: {
    ...config.extra,
    tmdbApiKey: process.env.TMDB_API_KEY,
  },
});
