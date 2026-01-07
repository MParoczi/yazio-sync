/**
 * useCalendar Hook
 * Manages calendar state and date selection
 */

import { useState, useCallback } from 'react';
import { useNutritionData } from './useNutritionData';
import { toast } from '../components/ui/Toast';
import { formatDate } from '../utils/formatters';

export interface UseCalendarReturn {
  isOpen: boolean;
  openCalendar: () => void;
  closeCalendar: () => void;
  selectDate: (date: Date) => void;
  goToToday: () => void;
  isToday: (date: Date) => boolean;
}

/**
 * Hook to manage calendar state and date selection
 *
 * @returns Calendar state and methods
 *
 * @example
 * ```tsx
 * const { isOpen, openCalendar, selectDate } = useCalendar();
 *
 * return (
 *   <>
 *     <button onClick={openCalendar}>Open Calendar</button>
 *     {isOpen && <DateSelector onSelect={selectDate} />}
 *   </>
 * );
 * ```
 */
export function useCalendar(): UseCalendarReturn {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedDate } = useNutritionData();

  /**
   * Open calendar modal
   */
  const openCalendar = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close calendar modal
   */
  const closeCalendar = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Select a date and update nutrition data
   */
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);

    // Show toast confirmation
    const formattedDate = formatDate(date, 'DISPLAY');
    toast.success(`Viewing data for ${formattedDate}`);
  }, [setSelectedDate]);

  /**
   * Go to today's date
   */
  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    toast.success('Viewing today\'s data');
  }, [setSelectedDate]);

  /**
   * Check if a date is today
   */
  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }, []);

  return {
    isOpen,
    openCalendar,
    closeCalendar,
    selectDate,
    goToToday,
    isToday,
  };
}
