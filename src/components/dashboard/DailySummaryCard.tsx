/**
 * DailySummaryCard Component
 * Displays daily macro summary with progress bars
 */

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { MacroProgress } from './MacroProgress';
import type { DailySummary } from '../../types';
import { formatDate } from '../../utils/formatters';
import { cardItem } from '../../utils/animations';

interface DailySummaryCardProps {
  summary: DailySummary;
  date: Date;
}

/**
 * DailySummaryCard Component
 * Shows consumed/remaining macros for the day
 */
export function DailySummaryCard({ summary, date }: DailySummaryCardProps) {
  const { consumed, goals } = summary;

  return (
    <motion.div variants={cardItem}>
      <GlassCard>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Daily Summary</h2>
            <span className="text-sm text-white/70">
              {formatDate(date, 'FULL')}
            </span>
          </div>

          {/* Macro Progress Bars */}
          <div className="space-y-6">
            <MacroProgress
              label="Calories"
              consumed={consumed.calories}
              goal={goals?.calories || null}
              type="calories"
            />
            <MacroProgress
              label="Carbohydrates"
              consumed={consumed.carbohydrates}
              goal={goals?.carbohydrates || null}
              type="carbohydrates"
            />
            <MacroProgress
              label="Protein"
              consumed={consumed.protein}
              goal={goals?.protein || null}
              type="protein"
            />
            <MacroProgress
              label="Fat"
              consumed={consumed.fat}
              goal={goals?.fat || null}
              type="fat"
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
