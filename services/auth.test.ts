/**
 * Auth Service Tests
 * Tests Firebase authentication flows: Google, Apple, Email Link, Sign-Out
 */

import { Platform } from 'react-native';
import {
  signInWithGoogle,
  signInWithApple,
  sendSignInEmailLink,
  confirmSignInEmailLink,
  signOut,
  getCurrentUser,
  onAuthStateChanged,
  isAppleSignInAvailable,
} from './auth';

const authModule = require('@react-native-firebase/auth');
const { GoogleSignin } = require('@react-native-google-signin/google-signin');
const AppleAuthentication = require('expo-apple-authentication');

// Modular API mocks
const { signInWithCredential, signOut: signOutModular, sendSignInLinkToEmail, signInWithEmailLink, getAuth } =
  authModule;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* --------------------------------------------------------------------------
     Google Sign-In
  -------------------------------------------------------------------------- */

  describe('signInWithGoogle', () => {
    it('should call hasPlayServices, signIn, and signInWithCredential', async () => {
      const result = await signInWithGoogle();

      expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
      expect(GoogleSignin.signIn).toHaveBeenCalled();
      expect(signInWithCredential).toHaveBeenCalled();
      expect(result.user).toBeDefined();
    });

    it('should throw when Google sign-in returns no idToken', async () => {
      GoogleSignin.signIn.mockResolvedValueOnce({ data: { idToken: null } });

      await expect(signInWithGoogle()).rejects.toThrow('No ID token from Google Sign-In');
    });

    it('should throw when Google signIn itself throws', async () => {
      GoogleSignin.signIn.mockRejectedValueOnce(new Error('Play services unavailable'));

      await expect(signInWithGoogle()).rejects.toThrow('Play services unavailable');
    });
  });

  /* --------------------------------------------------------------------------
     Apple Sign-In
  -------------------------------------------------------------------------- */

  describe('signInWithApple', () => {
    it('should call signInAsync, hash nonce, and signInWithCredential', async () => {
      const Crypto = require('expo-crypto');
      // updateProfile must be a function on the user returned by signInWithCredential
      const mockCredential = {
        user: {
          uid: 'uid', email: 'test@test.com', displayName: null,
          photoURL: null, providerData: [],
          updateProfile: jest.fn(() => Promise.resolve()),
        },
      };
      signInWithCredential.mockResolvedValueOnce(mockCredential);

      const result = await signInWithApple();

      expect(AppleAuthentication.signInAsync).toHaveBeenCalled();
      expect(Crypto.digestStringAsync).toHaveBeenCalled();
      expect(signInWithCredential).toHaveBeenCalled();
      expect(result.user).toBeDefined();
    });

    it('should throw when Apple returns no identityToken', async () => {
      AppleAuthentication.signInAsync.mockResolvedValueOnce({
        identityToken: null,
        authorizationCode: 'code',
        fullName: null,
        email: null,
      });

      await expect(signInWithApple()).rejects.toThrow('No identity token from Apple Sign-In');
    });
  });

  /* --------------------------------------------------------------------------
     Email Link Sign-In
  -------------------------------------------------------------------------- */

  describe('sendSignInEmailLink', () => {
    it('should call sendSignInLinkToEmail with correct action code settings', async () => {
      await sendSignInEmailLink('user@example.com');

      expect(sendSignInLinkToEmail).toHaveBeenCalledWith(
        expect.anything(), // auth instance
        'user@example.com',
        expect.objectContaining({
          handleCodeInApp: true,
          url: expect.stringContaining('twowatch.page.link'),
        })
      );
    });
  });

  describe('confirmSignInEmailLink', () => {
    it('should call signInWithEmailLink and return user credential', async () => {
      const result = await confirmSignInEmailLink('user@example.com', 'https://link');

      expect(signInWithEmailLink).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
        'https://link'
      );
      expect(result.user).toBeDefined();
    });
  });

  /* --------------------------------------------------------------------------
     Sign-Out
  -------------------------------------------------------------------------- */

  describe('signOut', () => {
    it('should call signOut without Google revocation when no provider', async () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = {
        providerData: [], // no google.com provider
        uid: 'uid',
      };

      await signOut();

      expect(signOutModular).toHaveBeenCalled();
      expect(GoogleSignin.revokeAccess).not.toHaveBeenCalled();
    });

    it('should revoke Google access when signed in with Google', async () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = {
        providerData: [{ providerId: 'google.com' }],
        uid: 'uid',
      };

      await signOut();

      expect(GoogleSignin.revokeAccess).toHaveBeenCalled();
      expect(GoogleSignin.signOut).toHaveBeenCalled();
      expect(signOutModular).toHaveBeenCalled();
    });

    it('should still sign out from Firebase even if Google revocation fails', async () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = {
        providerData: [{ providerId: 'google.com' }],
        uid: 'uid',
      };
      GoogleSignin.revokeAccess.mockRejectedValueOnce(new Error('Revoke failed'));

      await signOut();

      // Should not throw — Google errors are swallowed
      expect(signOutModular).toHaveBeenCalled();
    });

    it('should handle sign-out when no current user', async () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = null;

      await signOut();

      expect(signOutModular).toHaveBeenCalled();
      expect(GoogleSignin.revokeAccess).not.toHaveBeenCalled();
    });
  });

  /* --------------------------------------------------------------------------
     Utility functions
  -------------------------------------------------------------------------- */

  describe('getCurrentUser', () => {
    it('should return null when no user is signed in', () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = null;

      const user = getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return the current user when signed in', () => {
      const mockAuthInstance = getAuth();
      mockAuthInstance.currentUser = { uid: 'user-456', email: 'test@test.com' };

      const user = getCurrentUser();
      expect(user?.uid).toBe('user-456');

      mockAuthInstance.currentUser = null;
    });
  });

  describe('onAuthStateChanged', () => {
    it('should return an unsubscribe function', () => {
      const { onAuthStateChanged: modularOnAuthStateChanged } = authModule;
      const callback = jest.fn();

      const unsubscribe = onAuthStateChanged(callback);

      expect(modularOnAuthStateChanged).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('isAppleSignInAvailable', () => {
    it('should return true on iOS', () => {
      (Platform as any).OS = 'ios';
      expect(isAppleSignInAvailable()).toBe(true);
    });

    it('should return false on Android', () => {
      (Platform as any).OS = 'android';
      expect(isAppleSignInAvailable()).toBe(false);
    });

    afterEach(() => {
      (Platform as any).OS = 'ios'; // Reset to default
    });
  });
});
