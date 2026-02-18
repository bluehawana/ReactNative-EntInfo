import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as authService from '../services/auth';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  confirmEmailLink: (email: string, link: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle();
  }, []);

  const signInWithApple = useCallback(async () => {
    await authService.signInWithApple();
  }, []);

  const sendEmailLink = useCallback(async (email: string) => {
    await authService.sendSignInEmailLink(email);
  }, []);

  const confirmEmailLink = useCallback(async (email: string, link: string) => {
    await authService.confirmSignInEmailLink(email, link);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    signInWithGoogle,
    signInWithApple,
    sendEmailLink,
    confirmEmailLink,
    signOut,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
