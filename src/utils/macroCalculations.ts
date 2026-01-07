/**
 * Macro Calculation Utilities
 * Functions for calculating macro summaries and remaining values
 */

import type { MacroValues, FoodItem, MealGroup } from '../types/nutrition';

/**
 * Sum multiple MacroValues objects
 */
export function sumMacros(macros: MacroValues[]): MacroValues {
  return macros.reduce(
    (sum, macro) => ({
      carbohydrates: sum.carbohydrates + macro.carbohydrates,
      protein: sum.protein + macro.protein,
      fat: sum.fat + macro.fat,
      calories: sum.calories + macro.calories,
    }),
    {
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    }
  );
}

/**
 * Calculate remaining macros (goal - consumed)
 * Returns 0 if no goals or if consumed exceeds goal
 */
export function calculateRemaining(
  consumed: MacroValues,
  goals: MacroValues | null
): MacroValues {
  if (!goals) {
    return {
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    };
  }

  return {
    carbohydrates: Math.max(0, goals.carbohydrates - consumed.carbohydrates),
    protein: Math.max(0, goals.protein - consumed.protein),
    fat: Math.max(0, goals.fat - consumed.fat),
    calories: Math.max(0, goals.calories - consumed.calories),
  };
}

/**
 * Calculate meal summary from food items
 */
export function calculateMealSummary(items: FoodItem[]): MacroValues {
  if (items.length === 0) {
    return {
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    };
  }

  return sumMacros(items.map((item) => item.macros));
}

/**
 * Calculate daily summary from meals
 */
export function calculateDailySummary(meals: MealGroup[]): MacroValues {
  return sumMacros(meals.map((meal) => meal.summary));
}

/**
 * Calculate percentage of goal consumed
 * Returns 0 if no goal set
 */
export function calculateGoalPercentage(
  consumed: number,
  goal: number | null
): number {
  if (!goal || goal === 0) return 0;
  return (consumed / goal) * 100;
}

/**
 * Check if macro goal is exceeded
 */
export function isGoalExceeded(consumed: number, goal: number | null): boolean {
  if (!goal) return false;
  return consumed > goal;
}

/**
 * Get color indicator based on goal consumption
 * - green: < 100%
 * - yellow: 100-110%
 * - red: > 110%
 */
export function getGoalColorIndicator(
  consumed: number,
  goal: number | null
): 'green' | 'yellow' | 'red' | 'gray' {
  if (!goal) return 'gray';

  const percentage = calculateGoalPercentage(consumed, goal);

  if (percentage < 100) return 'green';
  if (percentage <= 110) return 'yellow';
  return 'red';
}
