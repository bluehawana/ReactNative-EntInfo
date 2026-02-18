import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.googleWebClientId,
});

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) throw new Error('No ID token from Google Sign-In');
  const credential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(credential);
}

export async function signInWithApple(): Promise<FirebaseAuthTypes.UserCredential> {
  const nonce = Math.random().toString(36).substring(2, 10);
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  const { identityToken } = appleCredential;
  if (!identityToken) throw new Error('No identity token from Apple Sign-In');

  const credential = auth.AppleAuthProvider.credential(identityToken, nonce);
  const userCredential = await auth().signInWithCredential(credential);

  // Apple only provides name on first sign-in, so update profile if available
  if (appleCredential.fullName?.givenName && !userCredential.user.displayName) {
    const displayName = [
      appleCredential.fullName.givenName,
      appleCredential.fullName.familyName,
    ]
      .filter(Boolean)
      .join(' ');
    await userCredential.user.updateProfile({ displayName });
  }

  return userCredential;
}

export async function sendSignInEmailLink(email: string): Promise<void> {
  const actionCodeSettings: FirebaseAuthTypes.ActionCodeSettings = {
    handleCodeInApp: true,
    url: 'https://twowatch.page.link/email-signin',
    iOS: { bundleId: 'com.twowatch.app' },
    android: {
      packageName: 'com.twowatch.app',
      installApp: true,
    },
  };
  await auth().sendSignInLinkToEmail(email, actionCodeSettings);
}

export async function confirmSignInEmailLink(
  email: string,
  link: string
): Promise<FirebaseAuthTypes.UserCredential> {
  return auth().signInWithEmailLink(email, link);
}

export async function signOut(): Promise<void> {
  const currentUser = auth().currentUser;
  if (currentUser) {
    // Check if signed in with Google
    const googleProvider = currentUser.providerData.find(
      (p) => p.providerId === 'google.com'
    );
    if (googleProvider) {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch {
        // Google sign-out may fail if not signed in with Google
      }
    }
  }
  await auth().signOut();
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  return auth().onAuthStateChanged(callback);
}

export function isAppleSignInAvailable(): boolean {
  return Platform.OS === 'ios';
}
