/**
 * YAZIO Daily Nutrition Summary API Route
 *
 * GET /api/yazio/nutrition/daily-summary?date=YYYY-MM-DD
 * Fetches daily nutrition summary from YAZIO API
 */

import { NextRequest } from 'next/server';
import { getUserDailySummary } from 'yazio/api';
import { successResponse, errorResponse } from '@/lib/api/responses';
import { extractTokenFromHeader, validateDateString } from '@/lib/api/validation';
import { YazioApiError } from '@/lib/api/errors';
import { formatDateForAPI } from '@/utils/formatters';

/**
 * GET /api/yazio/nutrition/daily-summary
 *
 * Fetch daily nutrition summary for a specific date
 *
 * Headers:
 * - Authorization: Bearer <token_json_string>
 *
 * Query Parameters:
 * - date (optional): ISO date string (YYYY-MM-DD), defaults to today
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ... UserDailySummary ... }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    // Extract and validate date parameter
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    let dateString: string;
    if (dateParam) {
      dateString = validateDateString(dateParam);
    } else {
      // Default to today
      dateString = formatDateForAPI(new Date());
    }

    // Fetch daily summary from YAZIO API
    try {
      const summary = await getUserDailySummary(token, { date: dateString });
      return successResponse(summary);
    } catch (error) {
      // Check if it's an authentication error
      if (
        error instanceof Error &&
        (error.message.includes('401') || error.message.includes('Unauthorized'))
      ) {
        throw new YazioApiError('Your session has expired. Please log in again.', 401);
      }

      // Log error for debugging
      console.error('[API] YAZIO API error:', error);

      // Generic YAZIO API error
      throw new YazioApiError('Failed to fetch nutrition data from YAZIO API', 500);
    }
  } catch (error) {
    console.error('[API] Daily summary route error:', error);
    return errorResponse(error as Error);
  }
}
