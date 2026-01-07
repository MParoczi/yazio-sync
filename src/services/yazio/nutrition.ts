/**
 * YAZIO Nutrition Data Service
 * Fetches and transforms nutrition data from YAZIO API
 */

import type { Token, UserDailySummary } from './types';
import type {
  DailyNutritionData,
  MealGroup,
  MacroValues,
  DailySummary,
} from '../../types/nutrition';
import { MEAL_TYPES } from '../../utils/constants';
import { calculateRemaining } from '../../utils/macroCalculations';
import { formatDateForAPI } from '../../utils/formatters';

/**
 * Group meals from YAZIO daily summary response
 * Note: This currently uses aggregated meal data from the API
 * TODO: In future phases, fetch individual food items using getUserConsumedItems + getProduct
 */
function groupByMealType(summary: UserDailySummary): MealGroup[] {
  // Create meal groups from daily summary
  return MEAL_TYPES.map((mealType) => {
    const mealData = summary.meals[mealType];

    // Extract macros from meal nutrients
    const macros: MacroValues = {
      carbohydrates: mealData?.nutrients['nutrient.carb'] || 0,
      protein: mealData?.nutrients['nutrient.protein'] || 0,
      fat: mealData?.nutrients['nutrient.fat'] || 0,
      calories: mealData?.nutrients['energy.energy'] || 0,
    };

    return {
      type: mealType,
      items: [], // TODO: Fetch individual items in Phase 4
      summary: macros,
    };
  });
}

/**
 * Extract macro goals from YAZIO daily summary
 */
function extractGoals(summary: UserDailySummary): MacroValues | null {
  if (!summary.goals) {
    return null;
  }

  return {
    carbohydrates: summary.goals['nutrient.carb'] || 0,
    protein: summary.goals['nutrient.protein'] || 0,
    fat: summary.goals['nutrient.fat'] || 0,
    calories: summary.goals['energy.energy'] || 0,
  };
}

/**
 * Fetch daily nutrition data from YAZIO API
 * Uses daily summary for aggregated meal data
 *
 * @param token - YAZIO API token
 * @param date - Date to fetch data for (defaults to today)
 * @returns Transformed daily nutrition data
 */
export async function fetchDailyNutrition(
  token: Token,
  date: Date = new Date()
): Promise<DailyNutritionData> {
  try {
    // Format date for API
    const dateString = formatDateForAPI(date);

    // Serialize token for Authorization header
    const tokenString = JSON.stringify(token);

    // Fetch daily summary from our API route
    const response = await fetch(
      `/api/yazio/nutrition/daily-summary?date=${dateString}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenString}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Check if it's an authentication error
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      throw new Error(data.error?.message || 'Failed to fetch nutrition data');
    }

    const summaryResponse = data.data;

    // Group by meal type (using aggregated data)
    const meals = groupByMealType(summaryResponse);

    // Extract goals
    const goals = extractGoals(summaryResponse);

    // Calculate consumed totals from meals
    const consumed: MacroValues = {
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    };

    meals.forEach((meal) => {
      consumed.carbohydrates += meal.summary.carbohydrates;
      consumed.protein += meal.summary.protein;
      consumed.fat += meal.summary.fat;
      consumed.calories += meal.summary.calories;
    });

    // Calculate remaining
    const remaining = calculateRemaining(consumed, goals);

    const summary: DailySummary = {
      consumed,
      goals,
      remaining,
    };

    return {
      date,
      summary,
      meals,
      cachedAt: new Date(),
    };
  } catch (error) {
    console.error('Failed to fetch nutrition data:', error);

    // Check if it's an authentication error
    if (
      error instanceof Error &&
      (error.message.includes('session has expired') ||
       error.message.includes('401') ||
       error.message.includes('Unauthorized'))
    ) {
      throw new Error('Your session has expired. Please log in again.');
    }

    // Generic error
    throw new Error(
      'Failed to load nutrition data. Please check your connection and try again.'
    );
  }
}
