import { useCallback, useEffect, useState } from 'react';

import { appConfig } from '../config/appConfig';
import type { AppScreen } from '../models/AppScreen';
import type { User } from '../models/User';

export interface AppFlowState {
  currentScreen: AppScreen;
  currentUser: User | null;
  completeAuthentication: (user: User) => void;
  signOut: () => void;
}

export function useAppFlow(): AppFlowState {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setCurrentScreen('login');
    }, appConfig.splashDurationMs);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  const completeAuthentication = useCallback((user: User) => {
    setCurrentUser(user);
    setCurrentScreen('home');
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setCurrentScreen('login');
  }, []);

  return {
    currentScreen,
    currentUser,
    completeAuthentication,
    signOut,
  };
}
