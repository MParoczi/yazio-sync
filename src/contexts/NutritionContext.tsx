'use client';

/**
 * Nutrition Context
 * Provides global nutrition data state and methods
 */

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { NutritionContextValue, DailyNutritionData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { fetchDailyNutrition } from '../services/yazio/nutrition';
import { NutritionCache } from '../services/storage/cache';
import { toast } from '../components/ui/Toast';

/**
 * Nutrition Context - provides nutrition data across the app
 */
export const NutritionContext = createContext<NutritionContextValue | undefined>(undefined);

interface NutritionProviderProps {
  children: ReactNode;
}

/**
 * Global nutrition cache instance
 */
const nutritionCache = new NutritionCache();

/**
 * NutritionProvider Component
 * Wraps the app to provide nutrition data state and methods
 */
export function NutritionProvider({ children }: NutritionProviderProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [nutritionData, setNutritionData] = useState<DailyNutritionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch nutrition data for the selected date
   */
  const fetchData = useCallback(async (date: Date, skipCache: boolean = false) => {
    // Check if authenticated
    if (!session?.isAuthenticated || !session.token) {
      setNutritionData(null);
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first (unless skipping)
      if (!skipCache) {
        const cachedData = nutritionCache.get(date);
        if (cachedData) {
          setNutritionData(cachedData);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      const data = await fetchDailyNutrition(session.token, date);

      // Update cache and state
      nutritionCache.set(date, data);
      setNutritionData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load nutrition data';
      setError(errorMessage);

      // Check if it's an auth error
      if (errorMessage.includes('session has expired') || errorMessage.includes('Unauthorized')) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [session, router]);

  /**
   * Refresh current date data (bypass cache)
   */
  const refresh = useCallback(async () => {
    // Invalidate cache for selected date
    nutritionCache.invalidate(selectedDate);

    // Show loading toast
    const toastId = toast.loading('Refreshing nutrition data...');

    try {
      await fetchData(selectedDate, true);
      toast.success('Data refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh data');
    }
  }, [selectedDate, fetchData]);

  /**
   * Fetch data when selected date or session changes
   */
  useEffect(() => {
    if (session?.isAuthenticated) {
      fetchData(selectedDate);
    } else {
      setNutritionData(null);
      setError(null);
    }
  }, [selectedDate, session?.isAuthenticated, fetchData]);

  const contextValue: NutritionContextValue = {
    selectedDate,
    setSelectedDate,
    nutritionData,
    isLoading,
    error,
    refresh,
  };

  return (
    <NutritionContext.Provider value={contextValue}>
      {children}
    </NutritionContext.Provider>
  );
}
