/**
 * Text Exporter Service
 * Exports nutrition data to structured .txt format
 */

import type { DailyNutritionData } from '../../types';
import { formatDate, formatMacroValue } from '../../utils/formatters';

/**
 * Generate export header with date range
 */
function generateHeader(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate, 'DISPLAY');
  const end = formatDate(endDate, 'DISPLAY');

  return [
    '='.repeat(70),
    'YAZIO NUTRITION DATA EXPORT',
    '='.repeat(70),
    '',
    `Date Range: ${start} - ${end}`,
    `Exported: ${formatDate(new Date(), 'FULL')}`,
    '',
    '='.repeat(70),
    '',
  ].join('\n');
}

/**
 * Format daily nutrition data section
 */
function formatDailySection(data: DailyNutritionData): string {
  const lines: string[] = [];
  const { date, summary, meals } = data;

  // Date header
  lines.push(`DATE: ${formatDate(date, 'FULL')}`);
  lines.push('-'.repeat(70));
  lines.push('');

  // Check if there's any data for this day
  const hasData = summary.consumed.calories > 0;

  if (!hasData) {
    lines.push('  No data logged for this day');
    lines.push('');
    return lines.join('\n');
  }

  // Daily summary
  lines.push('DAILY SUMMARY:');
  lines.push(`  Calories:       ${formatMacroValue(summary.consumed.calories, 'calories', 0)}`);
  if (summary.goals) {
    lines.push(`                  Goal: ${formatMacroValue(summary.goals.calories, 'calories', 0)}`);
    lines.push(`                  Remaining: ${formatMacroValue(summary.remaining.calories, 'calories', 0)}`);
  }
  lines.push('');
  lines.push(`  Carbohydrates:  ${formatMacroValue(summary.consumed.carbohydrates, 'carbohydrates', 1)}`);
  if (summary.goals) {
    lines.push(`                  Goal: ${formatMacroValue(summary.goals.carbohydrates, 'carbohydrates', 1)}`);
  }
  lines.push('');
  lines.push(`  Protein:        ${formatMacroValue(summary.consumed.protein, 'protein', 1)}`);
  if (summary.goals) {
    lines.push(`                  Goal: ${formatMacroValue(summary.goals.protein, 'protein', 1)}`);
  }
  lines.push('');
  lines.push(`  Fat:            ${formatMacroValue(summary.consumed.fat, 'fat', 1)}`);
  if (summary.goals) {
    lines.push(`                  Goal: ${formatMacroValue(summary.goals.fat, 'fat', 1)}`);
  }
  lines.push('');
  lines.push('');

  // Meals
  lines.push('MEALS:');
  lines.push('');

  meals.forEach((meal) => {
    const mealHasData = meal.summary.calories > 0;

    if (!mealHasData) {
      return; // Skip empty meals
    }

    // Meal header
    const mealName = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);
    lines.push(`  ${mealName.toUpperCase()}`);
    lines.push(`  ${'-'.repeat(60)}`);

    // Food items
    if (meal.items.length > 0) {
      meal.items.forEach((item) => {
        lines.push(`    - ${item.name}`);
        lines.push(`      Quantity: ${item.quantity}`);
        lines.push(`      Calories: ${formatMacroValue(item.macros.calories, 'calories', 0)} | ` +
                   `Carbs: ${formatMacroValue(item.macros.carbohydrates, 'carbohydrates', 1)} | ` +
                   `Protein: ${formatMacroValue(item.macros.protein, 'protein', 1)} | ` +
                   `Fat: ${formatMacroValue(item.macros.fat, 'fat', 1)}`);
        lines.push('');
      });
    }

    // Meal totals
    lines.push(`  MEAL TOTALS:`);
    lines.push(`    Calories:      ${formatMacroValue(meal.summary.calories, 'calories', 0)}`);
    lines.push(`    Carbohydrates: ${formatMacroValue(meal.summary.carbohydrates, 'carbohydrates', 1)}`);
    lines.push(`    Protein:       ${formatMacroValue(meal.summary.protein, 'protein', 1)}`);
    lines.push(`    Fat:           ${formatMacroValue(meal.summary.fat, 'fat', 1)}`);
    lines.push('');
    lines.push('');
  });

  lines.push('='.repeat(70));
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate export text from nutrition data
 */
export function generateExportText(
  data: DailyNutritionData[],
  startDate: Date,
  endDate: Date
): string {
  // Handle empty data
  if (data.length === 0) {
    return [
      generateHeader(startDate, endDate),
      'No data available for this date range.',
      '',
      'This could mean:',
      '  - No nutrition data was logged during this period',
      '  - The selected date range contains only future dates',
      '  - There was an error fetching the data',
      '',
    ].join('\n');
  }

  // Check if all days have no data
  const hasAnyData = data.some(d => d.summary.consumed.calories > 0);

  if (!hasAnyData) {
    return [
      generateHeader(startDate, endDate),
      'No nutrition data was logged during this period.',
      '',
    ].join('\n');
  }

  // Generate export
  const sections = data.map(d => formatDailySection(d));

  return [
    generateHeader(startDate, endDate),
    ...sections,
    '',
    'End of Export',
    '='.repeat(70),
  ].join('\n');
}

/**
 * Trigger browser download of text file
 */
export function downloadTextFile(content: string, filename: string): void {
  // Create blob
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
