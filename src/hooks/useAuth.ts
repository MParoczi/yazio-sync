/**
 * useAuth Hook
 * Custom hook to access authentication context
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextValue } from '../types';

/**
 * Hook to access authentication state and methods
 *
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextValue with session, login, logout, isLoading, error
 *
 * @example
 * ```tsx
 * const { session, login, logout, isLoading } = useAuth();
 *
 * if (session?.isAuthenticated) {
 *   return <Dashboard />;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
