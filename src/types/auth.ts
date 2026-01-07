/**
 * Authentication Types
 * Type definitions for user authentication and session management
 */

import type { Token, Credentials as YazioCredentials } from 'yazio/auth';

/**
 * User credentials for login (re-export from yazio)
 * Note: YAZIO uses email as username
 */
export type Credentials = YazioCredentials;

/**
 * Encrypted token data stored in localStorage
 */
export interface EncryptedTokenData {
  data: string; // Base64 encoded encrypted token
  iv: string; // Base64 encoded initialization vector
}

/**
 * User session state
 */
export interface UserSession {
  token: Token; // YAZIO API token
  isAuthenticated: boolean;
  rememberMe: boolean;
  expiresAt: Date | null;
}

/**
 * Auth context value interface
 */
export interface AuthContextValue {
  session: UserSession | null;
  login: (credentials: Credentials, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
