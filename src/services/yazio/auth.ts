/**
 * YAZIO Authentication Service
 * Wraps YAZIO API authentication with error handling and retry logic
 */

import type { Credentials, Token } from './types';

/**
 * Maximum number of retry attempts for network errors
 */
const MAX_RETRIES = 3;

/**
 * Delay between retries (in milliseconds)
 */
const RETRY_DELAY = 1000;

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Authenticate user with YAZIO API
 * Includes automatic retry logic for network errors
 *
 * @param credentials - User email and password
 * @returns YAZIO API token
 * @throws Error if authentication fails
 */
export async function authenticateUser(
  credentials: Credentials
): Promise<Token> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Call our Next.js API route instead of YAZIO directly
      const response = await fetch('/api/yazio/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // API returned error - extract message from response
        throw new Error(data.error?.message || 'Authentication failed');
      }

      return data.data.token;
    } catch (error) {
      lastError = error as Error;

      // Check if it's a network error (retryable)
      const isNetworkError =
        error instanceof TypeError &&
        (error.message.includes('fetch') ||
          error.message.includes('network'));

      // Don't retry on authentication errors (401)
      const isAuthError =
        error instanceof Error &&
        (error.message.includes('401') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('Invalid credentials'));

      if (isAuthError) {
        throw new Error(
          'Invalid email or password. Please check your credentials and try again.'
        );
      }

      // Retry on network errors
      if (isNetworkError && attempt < MAX_RETRIES - 1) {
        console.warn(
          `Authentication attempt ${attempt + 1} failed, retrying...`
        );
        await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }

      // If not retryable or max retries reached, throw
      break;
    }
  }

  // All retries failed
  if (lastError) {
    console.error('Authentication failed after retries:', lastError);
    throw new Error(
      'Unable to connect to YAZIO. Please check your internet connection and try again.'
    );
  }

  // Should never reach here, but TypeScript needs it
  throw new Error('Authentication failed for unknown reason');
}

/**
 * Validate token (check if it's well-formed)
 * Note: This doesn't check if the token is expired or valid with YAZIO API
 */
export function isValidTokenStructure(token: unknown): token is Token {
  if (!token || typeof token !== 'object') {
    return false;
  }

  // Basic structure check (YAZIO Token has access_token property)
  return 'access_token' in token;
}
