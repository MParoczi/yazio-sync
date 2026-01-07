'use client';

/**
 * Authentication Context
 * Provides global authentication state and methods for login/logout
 */

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthContextValue, UserSession, Credentials } from '../types';
import { authenticateUser } from '../services/yazio/auth';
import { storeToken, retrieveToken, clearToken } from '../services/storage/tokenStorage';
import { toast } from '../components/ui/Toast';

/**
 * Token expiration check interval (5 minutes)
 */
const TOKEN_CHECK_INTERVAL = 300000;

/**
 * Token expiration time (24 hours in milliseconds)
 * Note: YAZIO tokens typically expire after 24 hours
 */
const TOKEN_EXPIRATION_TIME = 86400000;

/**
 * Auth Context - provides authentication state across the app
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Wraps the app to provide authentication state and methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if session is expired
   */
  const isSessionExpired = (session: UserSession): boolean => {
    if (!session.expiresAt) return false;
    return new Date() > session.expiresAt;
  };

  /**
   * Auto-load stored token on mount
   */
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await retrieveToken();

        if (storedToken) {
          // Create session from stored token
          const loadedSession: UserSession = {
            token: storedToken,
            isAuthenticated: true,
            rememberMe: true,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
          };

          // Check if expired
          if (isSessionExpired(loadedSession)) {
            await clearToken();
            setSession(null);
            toast.error('Your session has expired. Please log in again.');
          } else {
            setSession(loadedSession);
          }
        }
      } catch (error) {
        console.error('Failed to load stored token:', error);
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  /**
   * Login method
   */
  const handleLogin = async (credentials: Credentials, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Authenticate with YAZIO API
      const token = await authenticateUser(credentials);

      // Create session
      const newSession: UserSession = {
        token,
        isAuthenticated: true,
        rememberMe,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
      };

      // Store token if remember me is enabled
      if (rememberMe) {
        await storeToken(token, rememberMe);
      }

      // Update session state
      setSession(newSession);

      toast.success('Successfully logged in!');

      // Redirect to dashboard (will be created in Phase 4)
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout method
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      // Clear stored token
      await clearToken();

      // Clear session state
      setSession(null);
      setError(null);

      toast.success('Successfully logged out');

      // Redirect to login page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
    }
  }, [router]);

  /**
   * Periodic token expiration check
   */
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (isSessionExpired(session)) {
        handleLogout();
        toast.error('Your session has expired. Please log in again.');
      }
    }, TOKEN_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [session, handleLogout]);

  const contextValue: AuthContextValue = {
    session,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
