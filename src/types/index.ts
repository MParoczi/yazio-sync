/**
 * Types Index
 * Central export point for all application types
 */

// Auth types
export type {
  Credentials,
  EncryptedTokenData,
  UserSession,
  AuthContextValue,
} from './auth';

// Nutrition types
export type {
  MacroValues,
  FoodItem,
  MealGroup,
  DailySummary,
  DailyNutritionData,
  NutritionContextValue,
  ExportRequest,
} from './nutrition';

// YAZIO API types
export type {
  Token,
  UserConsumedItem,
  UserDailySummary,
  UserGoals,
  GetConsumedItemsOptions,
  GetDailySummaryOptions,
} from '../services/yazio/types';
