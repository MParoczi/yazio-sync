/**
 * API Error Classes
 *
 * Provides structured error handling for API routes with HTTP status codes
 */

/**
 * Base API error class with status code and optional error code
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 400 Bad Request - Invalid input or validation error
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

/**
 * 500 Internal Server Error - Generic server error
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

/**
 * YAZIO-specific API errors
 */
export class YazioApiError extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, 'YAZIO_API_ERROR');
  }
}
