/**
 * YAZIO Authentication API Route
 *
 * POST /api/yazio/auth
 * Authenticates user credentials with YAZIO API and returns token
 */

import { NextRequest } from 'next/server';
import { YazioAuth } from 'yazio/auth';
import { successResponse, errorResponse } from '@/lib/api/responses';
import { validateCredentials } from '@/lib/api/validation';
import { YazioApiError } from '@/lib/api/errors';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/yazio/auth
 *
 * Authenticate user with YAZIO API
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "token": { ... }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate credentials
    const credentials = validateCredentials(body);

    // Authenticate with retry logic
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const auth = new YazioAuth({ credentials });
        const token = await auth.authenticate();
        return successResponse({ token });
      } catch (error) {
        lastError = error as Error;

        // Check if it's an authentication error (401 - don't retry)
        const isAuthError =
          error instanceof Error &&
          (error.message.includes('401') ||
            error.message.includes('Unauthorized') ||
            error.message.includes('Invalid credentials'));

        if (isAuthError) {
          throw new YazioApiError(
            'Invalid email or password. Please check your credentials and try again.',
            401
          );
        }

        // Check if it's a network error (retryable)
        const isNetworkError =
          error instanceof TypeError &&
          (error.message.includes('fetch') || error.message.includes('network'));

        // Retry on network errors
        if (isNetworkError && attempt < MAX_RETRIES - 1) {
          console.warn(
            `[API] Authentication attempt ${attempt + 1} failed, retrying...`
          );
          await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }

        // If not retryable or max retries reached, break
        break;
      }
    }

    // All retries failed
    console.error('[API] Authentication failed after retries:', lastError);
    throw new YazioApiError(
      'Unable to connect to YAZIO. Please check your internet connection and try again.',
      503
    );
  } catch (error) {
    console.error('[API] Auth route error:', error);
    return errorResponse(error as Error);
  }
}
