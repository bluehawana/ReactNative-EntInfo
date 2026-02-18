/**
 * Jest Setup File
 * Configure testing environment for React Native
 */

import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock @react-native-firebase/auth
jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb) => { cb(null); return jest.fn(); }),
    signOut: jest.fn(() => Promise.resolve()),
    signInWithCredential: jest.fn(() => Promise.resolve({ user: { uid: 'uid', email: 'test@test.com', displayName: null, photoURL: null } })),
    sendSignInLinkToEmail: jest.fn(() => Promise.resolve()),
    signInWithEmailLink: jest.fn(() => Promise.resolve({ user: { uid: 'uid' } })),
    isSignInWithEmailLink: jest.fn(() => false),
  };
  const authFn = jest.fn(() => mockAuth);
  const GoogleAuthProvider = { credential: jest.fn(() => ({})) };
  const AppleAuthProvider = { credential: jest.fn(() => ({})) };
  authFn.GoogleAuthProvider = GoogleAuthProvider;
  authFn.AppleAuthProvider = AppleAuthProvider;

  return {
    __esModule: true,
    default: authFn,
    getAuth: jest.fn(() => mockAuth),
    onAuthStateChanged: jest.fn((_auth, cb) => mockAuth.onAuthStateChanged(cb)),
    signOut: jest.fn((_auth) => mockAuth.signOut()),
    signInWithCredential: jest.fn((_auth, credential) => mockAuth.signInWithCredential(credential)),
    sendSignInLinkToEmail: jest.fn((_auth, email, actionCodeSettings) =>
      mockAuth.sendSignInLinkToEmail(email, actionCodeSettings)
    ),
    signInWithEmailLink: jest.fn((_auth, email, link) => mockAuth.signInWithEmailLink(email, link)),
    isSignInWithEmailLink: jest.fn((_auth, link) => mockAuth.isSignInWithEmailLink(link)),
    GoogleAuthProvider,
    AppleAuthProvider,
  };
});

// Mock @react-native-firebase/firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockDocSnapshot = {
    exists: jest.fn(() => false),
    data: jest.fn(() => null),
  };
  const mockDocRef = {
    get: jest.fn(() => Promise.resolve(mockDocSnapshot)),
    set: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  };
  const mockCollectionRef = {
    doc: jest.fn(() => mockDocRef),
    orderBy: jest.fn(function() { return this; }),
    get: jest.fn(() => Promise.resolve({ docs: [] })),
  };
  mockDocRef.collection = jest.fn(() => mockCollectionRef);
  const mockBatch = {
    set: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  };
  const mockFirestore = {
    collection: jest.fn(() => mockCollectionRef),
    batch: jest.fn(() => mockBatch),
  };
  const firestoreFn = jest.fn(() => mockFirestore);

  return {
    __esModule: true,
    default: firestoreFn,
    getFirestore: jest.fn(() => mockFirestore),
    collection: jest.fn((_parent, ...segments) => ({
      ...mockCollectionRef,
      path: segments.join('/'),
    })),
    doc: jest.fn((_parent, ...segments) => ({
      ...mockDocRef,
      path: segments.join('/'),
    })),
    orderBy: jest.fn((fieldPath, directionStr = 'asc') => ({
      type: 'orderBy',
      fieldPath,
      directionStr,
    })),
    query: jest.fn((base, ...constraints) => ({
      base,
      constraints,
    })),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    setDoc: jest.fn(() => Promise.resolve()),
    deleteDoc: jest.fn(() => Promise.resolve()),
    getDoc: jest.fn(() => Promise.resolve(mockDocSnapshot)),
    writeBatch: jest.fn(() => mockBatch),
  };
});

// Mock @react-native-google-signin/google-signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ data: { idToken: 'mock-id-token' } })),
    signOut: jest.fn(() => Promise.resolve()),
    revokeAccess: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => false),
  },
}));

// Mock expo-apple-authentication
jest.mock('expo-apple-authentication', () => ({
  signInAsync: jest.fn(() => Promise.resolve({
    identityToken: 'mock-apple-identity-token',
    authorizationCode: 'mock-auth-code',
    fullName: { givenName: 'Jane', familyName: 'Doe' },
    email: 'jane@example.com',
  })),
  isAvailableAsync: jest.fn(() => Promise.resolve(false)),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
  AppleAuthenticationButtonStyle: { WHITE: 0, BLACK: 2 },
  AppleAuthenticationButtonType: { SIGN_IN: 0 },
}));

// Mock expo-crypto (used for Apple Sign-In nonce hashing)
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(() => Promise.resolve('hashed-nonce-abc123')),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      tmdbApiKey: 'test-api-key',
    },
  },
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'en-US' }],
  locale: 'en-US',
}));

// Mock axios
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(() => actualAxios),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  SelectionFeedbackStyle: {},
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock react-native/Libraries/Linking/Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve(true)),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}));

// Silence console during tests
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
