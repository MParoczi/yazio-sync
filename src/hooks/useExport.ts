/**
 * useExport Hook
 * Manages nutrition data export functionality
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { fetchDailyNutrition } from '../services/yazio/nutrition';
import { generateExportText, downloadTextFile } from '../services/export/txtExporter';
import { toast } from '../components/ui/Toast';
import { formatDate } from '../utils/formatters';
import { MAX_EXPORT_RANGE_DAYS } from '../utils/constants';
import { addDays, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';
import type { DailyNutritionData } from '../types';

export interface UseExportReturn {
  isExporting: boolean;
  progress: number;
  exportRange: (startDate: Date, endDate: Date) => Promise<void>;
}

/**
 * Validate date range for export
 */
function validateDateRange(startDate: Date, endDate: Date): string | null {
  const today = startOfDay(new Date());
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);

  // End date must be >= start date
  if (isBefore(end, start)) {
    return 'End date must be after start date';
  }

  // End date cannot be in the future
  if (isAfter(end, today)) {
    return 'End date cannot be in the future';
  }

  // Check max range (90 days)
  const daysDiff = differenceInDays(end, start) + 1; // +1 to include both days
  if (daysDiff > MAX_EXPORT_RANGE_DAYS) {
    return `Date range cannot exceed ${MAX_EXPORT_RANGE_DAYS} days`;
  }

  return null;
}

/**
 * Generate filename for export
 */
function generateFilename(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate, 'API');
  const end = formatDate(endDate, 'API');
  return `yazio-nutrition-${start}_to_${end}.txt`;
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hook to manage nutrition data export
 *
 * @returns Export state and methods
 */
export function useExport(): UseExportReturn {
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Export nutrition data for a date range
   */
  const exportRange = useCallback(async (startDate: Date, endDate: Date) => {
    // Validate authentication
    if (!session?.isAuthenticated || !session.token) {
      toast.error('You must be logged in to export data');
      return;
    }

    // Validate date range
    const validationError = validateDateRange(startDate, endDate);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Calculate days to fetch
      const days: Date[] = [];
      let currentDate = startOfDay(startDate);
      const end = startOfDay(endDate);

      while (currentDate <= end) {
        days.push(currentDate);
        currentDate = addDays(currentDate, 1);
      }

      const totalDays = days.length;
      const nutritionData: DailyNutritionData[] = [];

      // Show initial toast
      toast.loading(`Exporting ${totalDays} day(s) of nutrition data...`);

      // Fetch data for each day with progress tracking
      for (let i = 0; i < days.length; i++) {
        try {
          const data = await fetchDailyNutrition(session.token, days[i]);
          nutritionData.push(data);

          // Update progress
          const currentProgress = Math.round(((i + 1) / totalDays) * 100);
          setProgress(currentProgress);

          // Add small delay to avoid rate limiting (for ranges > 7 days)
          if (totalDays > 7 && i < days.length - 1) {
            await sleep(200);
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${formatDate(days[i], 'API')}:`, error);
          // Continue with other days even if one fails
        }
      }

      // Generate export text
      const exportText = generateExportText(nutritionData, startDate, endDate);

      // Generate filename
      const filename = generateFilename(startDate, endDate);

      // Trigger download
      downloadTextFile(exportText, filename);

      // Show success toast
      toast.success(`Successfully exported ${totalDays} day(s) of data`);
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [session]);

  return {
    isExporting,
    progress,
    exportRange,
  };
}
