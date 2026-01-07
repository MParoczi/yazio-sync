/**
 * Application Constants
 * Global configuration values and enums used throughout the application
 */

/**
 * Meal types supported by YAZIO API
 */
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export type MealType = typeof MEAL_TYPES[number];

/**
 * Cache configuration
 */
export const CACHE_TTL = 300000; // 5 minutes in milliseconds

/**
 * Date format strings (using date-fns)
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMMM d, yyyy', // e.g., "December 12, 2025"
  API: 'yyyy-MM-dd', // ISO format for API calls
  SHORT: 'MMM d', // e.g., "Dec 12"
  FULL: 'EEEE, MMMM d, yyyy', // e.g., "Thursday, December 12, 2025"
} as const;

/**
 * Export configuration
 */
export const MAX_EXPORT_RANGE_DAYS = 90; // Maximum date range for exports

/**
 * Loading delay threshold (show loading indicator after this delay)
 */
export const LOADING_DELAY_MS = 300;

/**
 * Token storage keys
 */
export const STORAGE_KEYS = {
  ENCRYPTED_TOKEN: 'yazio_encrypted_token',
  ENCRYPTION_IV: 'yazio_encryption_iv',
  ENCRYPTION_KEY: 'yazio_encryption_key', // stored in sessionStorage
} as const;

/**
 * Macro nutrient display labels
 */
export const MACRO_LABELS = {
  carbohydrates: 'Carbs',
  protein: 'Protein',
  fat: 'Fat',
  calories: 'Calories',
} as const;

/**
 * Macro nutrient units
 */
export const MACRO_UNITS = {
  carbohydrates: 'g',
  protein: 'g',
  fat: 'g',
  calories: 'kcal',
} as const;
