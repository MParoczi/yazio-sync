/**
 * FoodItemList Component
 * Displays list of food items in a meal
 */

import type { FoodItem } from '../../types';
import { formatMacroValue } from '../../utils/formatters';

interface FoodItemListProps {
  items: FoodItem[];
}

/**
 * FoodItemList Component
 * Shows food items with name, quantity, and macro values
 */
export function FoodItemList({ items }: FoodItemListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-start gap-4 py-2 border-b border-white/10 last:border-0"
        >
          {/* Item Name and Quantity */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{item.name}</h4>
            <p className="text-white/60 text-sm">{item.quantity}</p>
          </div>

          {/* Macros */}
          <div className="flex flex-col items-end text-xs text-white/70 space-y-1">
            <span className="font-semibold text-white">
              {formatMacroValue(item.macros.calories, 'calories', 0)}
            </span>
            <div className="flex gap-2">
              <span title="Carbohydrates">
                C: {formatMacroValue(item.macros.carbohydrates, 'carbohydrates', 0)}
              </span>
              <span title="Protein">
                P: {formatMacroValue(item.macros.protein, 'protein', 0)}
              </span>
              <span title="Fat">
                F: {formatMacroValue(item.macros.fat, 'fat', 0)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
