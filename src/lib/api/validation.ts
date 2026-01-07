/**
 * API Validation Utilities
 *
 * Provides validation functions for API route inputs
 */

import type { Token } from 'yazio/auth';
import { BadRequestError, UnauthorizedError } from './errors';

/**
 * Extract and validate token from Authorization header
 *
 * @param authHeader - The Authorization header value
 * @returns Parsed and validated Token object
 * @throws UnauthorizedError if header is missing, malformed, or invalid
 */
export function extractTokenFromHeader(authHeader: string | null): Token {
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid Authorization header format. Expected: Bearer <token>');
  }

  const tokenString = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const token = JSON.parse(tokenString) as Token;

    // Validate token structure - must have access_token property
    if (!token || typeof token !== 'object' || !('access_token' in token)) {
      throw new UnauthorizedError('Invalid token structure');
    }

    return token;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid token format');
  }
}

/**
 * Validate ISO date string (YYYY-MM-DD format)
 *
 * @param dateStr - The date string to validate
 * @returns The validated date string
 * @throws BadRequestError if date format is invalid or date is in the future
 */
export function validateDateString(dateStr: string): string {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateStr)) {
    throw new BadRequestError('Invalid date format. Expected YYYY-MM-DD');
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new BadRequestError('Invalid date value');
  }

  // Check date is not in the future
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) {
    throw new BadRequestError('Date cannot be in the future');
  }

  return dateStr;
}

/**
 * Input type for credentials validation
 */
export interface CredentialsInput {
  email?: unknown;
  username?: unknown;
  password?: unknown;
}

/**
 * Validated credentials type
 * Note: YAZIO uses 'username' but it's the user's email
 */
export interface ValidatedCredentials {
  username: string;
  password: string;
}

/**
 * Validate user credentials
 *
 * @param input - Raw credentials input from request body
 * @returns Validated credentials with trimmed values
 * @throws BadRequestError if email/username or password is missing or invalid
 */
export function validateCredentials(input: CredentialsInput): ValidatedCredentials {
  const { email, username, password } = input;

  // Accept either 'email' or 'username' field (YAZIO uses 'username')
  const userEmail = email || username;

  if (!userEmail || typeof userEmail !== 'string' || userEmail.trim().length === 0) {
    throw new BadRequestError('Email is required');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    throw new BadRequestError('Password is required');
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    throw new BadRequestError('Invalid email format');
  }

  return {
    username: userEmail.trim(),
    password: password.trim(),
  };
}
