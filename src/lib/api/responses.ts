/**
 * API Response Builders
 *
 * Provides standardized response formats for API routes
 */

import { NextResponse } from 'next/server';
import { ApiError } from './errors';

/**
 * Standardized success response format
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Standardized error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
  };
}

/**
 * Build a success response with data
 *
 * @param data - The data to return
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with standardized success format
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Build an error response from an Error or ApiError
 *
 * @param error - The error to convert to a response
 * @param fallbackStatus - Status code if error is not an ApiError (default: 500)
 * @returns NextResponse with standardized error format
 */
export function errorResponse(
  error: Error | ApiError,
  fallbackStatus = 500
): NextResponse {
  if (error instanceof ApiError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };
    return NextResponse.json(response, { status: error.statusCode });
  }

  // Generic error - don't expose internal details
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message: error.message || 'An unexpected error occurred',
      statusCode: fallbackStatus,
    },
  };
  return NextResponse.json(response, { status: fallbackStatus });
}
