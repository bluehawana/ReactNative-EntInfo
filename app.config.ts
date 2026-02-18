import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '2watch',
  slug: '2watch',
  plugins: [
    'expo-localization',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    ['@react-native-google-signin/google-signin', {
      iosUrlScheme: 'com.googleusercontent.apps.391837711816-epqml59ko2gkm58eebcik3vt8pmup6js',
    }],
    'expo-apple-authentication',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          forceStaticLinking: ['RNFBApp', 'RNFBAuth', 'RNFBFirestore'],
        },
      },
    ],
  ],
  extra: {
    ...config.extra,
    tmdbApiKey: process.env.TMDB_API_KEY,
    googleWebClientId: process.env['0Auth_Client_ID'],
  },
});
