/**
 * YAZIO API Types Wrapper
 * Re-exports types from the yazio package with custom extensions
 */

// Import types from yazio/auth
export type { Token, Credentials } from 'yazio/auth';

// Import functions from yazio/api for both use and type extraction
import {
  getTokenFromCredentials as _getTokenFromCredentials,
  getUserConsumedItems as _getUserConsumedItems,
  getUserDailySummary as _getUserDailySummary,
  getUserGoals as _getUserGoals,
} from 'yazio/api';

// Re-export functions
export const getTokenFromCredentials = _getTokenFromCredentials;
export const getUserConsumedItems = _getUserConsumedItems;
export const getUserDailySummary = _getUserDailySummary;
export const getUserGoals = _getUserGoals;

/**
 * Extract return types from YAZIO API functions
 */

// Extract consumed items response type
type GetUserConsumedItemsResponse = Awaited<ReturnType<typeof _getUserConsumedItems>>;

// Extract individual consumed item type from the products array
export type UserConsumedItem = GetUserConsumedItemsResponse['products'][number];

// Extract daily summary response type
export type UserDailySummary = Awaited<ReturnType<typeof _getUserDailySummary>>;

// Extract goals type from daily summary
export type UserGoals = UserDailySummary['goals'];

/**
 * Extended types for our application
 */

/**
 * Options for getUserConsumedItems
 */
export interface GetConsumedItemsOptions {
  date?: Date | string;
}

/**
 * Options for getUserDailySummary
 */
export interface GetDailySummaryOptions {
  date?: Date | string;
}
