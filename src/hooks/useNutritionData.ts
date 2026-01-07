/**
 * useNutritionData Hook
 * Custom hook to access nutrition data context
 */

import { useContext } from 'react';
import { NutritionContext } from '../contexts/NutritionContext';
import type { NutritionContextValue } from '../types';

/**
 * Hook to access nutrition data state and methods
 *
 * @throws Error if used outside of NutritionProvider
 * @returns NutritionContextValue with selectedDate, nutritionData, isLoading, error, refresh
 *
 * @example
 * ```tsx
 * const { nutritionData, isLoading, refresh } = useNutritionData();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (nutritionData) return <DailySummary data={nutritionData} />;
 * ```
 */
export function useNutritionData(): NutritionContextValue {
  const context = useContext(NutritionContext);

  if (context === undefined) {
    throw new Error('useNutritionData must be used within a NutritionProvider');
  }

  return context;
}
