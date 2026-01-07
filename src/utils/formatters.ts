/**
 * Formatting Utilities
 * Date, number, and macro value formatters
 */

import { format } from 'date-fns';
import { DATE_FORMATS, MACRO_UNITS } from './constants';

/**
 * Format a date for display
 * @param date - Date to format
 * @param formatStr - Format string (defaults to DISPLAY format)
 */
export function formatDate(
  date: Date | string,
  formatStr: keyof typeof DATE_FORMATS = 'DISPLAY'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, DATE_FORMATS[formatStr]);
}

/**
 * Format a date for API calls (ISO format: YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return format(date, DATE_FORMATS.API);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Format a macro value with its unit
 * @param value - The numeric value
 * @param type - The macro type (carbohydrates, protein, fat, calories)
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatMacroValue(
  value: number,
  type: 'carbohydrates' | 'protein' | 'fat' | 'calories',
  decimals: number = 1
): string {
  const formatted = value.toFixed(decimals);
  const unit = MACRO_UNITS[type];
  return `${formatted}${unit}`;
}

/**
 * Format a macro value without units (just the number)
 */
export function formatMacroNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format a quantity string (keep as-is from YAZIO API)
 * @param quantity - Quantity string from API (e.g., "100g", "1 serving")
 */
export function formatQuantity(quantity: string): string {
  // Return as-is per specification (no conversion)
  return quantity;
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Truncate text with ellipsis if it exceeds max length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
