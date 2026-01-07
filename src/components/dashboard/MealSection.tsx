/**
 * MealSection Component
 * Displays a single meal with food items and summary
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { FoodItemList } from './FoodItemList';
import { EmptyState } from './EmptyState';
import type { MealGroup } from '../../types';
import { formatMacroValue } from '../../utils/formatters';
import { cardItem } from '../../utils/animations';

interface MealSectionProps {
  meal: MealGroup;
}

/**
 * Get meal icon emoji
 */
function getMealIcon(mealType: string): string {
  switch (mealType) {
    case 'breakfast':
      return '🍳';
    case 'lunch':
      return '🍽️';
    case 'dinner':
      return '🌙';
    case 'snack':
      return '🍎';
    default:
      return '🍴';
  }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * MealSection Component
 * Shows meal header, items, and macro summary
 */
const MealSectionComponent = ({ meal }: MealSectionProps) => {
  const hasItems = meal.items.length > 0;
  const hasMacros = meal.summary.calories > 0;

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        {/* Meal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>{getMealIcon(meal.type)}</span>
            <span>{capitalize(meal.type)}</span>
          </h3>
          {hasMacros && (
            <div className="text-sm font-semibold text-white/90">
              {formatMacroValue(meal.summary.calories, 'calories', 0)}
            </div>
          )}
        </div>

        {/* Food Items */}
        {hasItems ? (
          <FoodItemList items={meal.items} />
        ) : !hasMacros ? (
          <EmptyState message="No items logged for this meal" />
        ) : null}

        {/* Meal Summary */}
        {hasMacros && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-white/60 mb-1">Carbs</div>
                <div className="text-sm font-semibold text-white">
                  {formatMacroValue(meal.summary.carbohydrates, 'carbohydrates', 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60 mb-1">Protein</div>
                <div className="text-sm font-semibold text-white">
                  {formatMacroValue(meal.summary.protein, 'protein', 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60 mb-1">Fat</div>
                <div className="text-sm font-semibold text-white">
                  {formatMacroValue(meal.summary.fat, 'fat', 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

// Memoized export to prevent unnecessary re-renders
export const MealSection = memo(MealSectionComponent);
