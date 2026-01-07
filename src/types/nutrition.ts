/**
 * Nutrition Data Types
 * Type definitions for nutrition data structures
 */

import type { MealType } from '../utils/constants';

/**
 * Macro nutrient values
 */
export interface MacroValues {
  carbohydrates: number; // grams
  protein: number; // grams
  fat: number; // grams
  calories: number; // kcal
}

/**
 * Individual food item
 */
export interface FoodItem {
  id: string;
  name: string;
  quantity: string; // e.g., "100g", "1 serving" (as returned by YAZIO API)
  macros: MacroValues;
}

/**
 * Meal group (breakfast, lunch, dinner, or snack)
 */
export interface MealGroup {
  type: MealType;
  items: FoodItem[];
  summary: MacroValues;
}

/**
 * Daily nutrition summary
 */
export interface DailySummary {
  consumed: MacroValues;
  goals: MacroValues | null;
  remaining: MacroValues;
}

/**
 * Daily nutrition data
 */
export interface DailyNutritionData {
  date: Date;
  summary: DailySummary;
  meals: MealGroup[];
  cachedAt: Date;
}

/**
 * Nutrition context value interface
 */
export interface NutritionContextValue {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  nutritionData: DailyNutritionData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Export request data
 */
export interface ExportRequest {
  startDate: Date;
  endDate: Date;
  data: DailyNutritionData[];
}
