module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.tsx', '**/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo-constants|expo-linear-gradient|expo-localization|expo-haptics|expo-blur|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|@expo/vector-icons|@expo/metro-runtime|axios-mock-adapter)/)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/android/**',
    '!**/ios/**',
    '!**/build/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000,
  moduleNameMapper: {
    '@expo/vector-icons': '<rootDir>/__mocks__/expo-vector-icons.js',
  },
};
