/**
 * MacroProgress Component
 * Displays progress bar for a single macro nutrient
 */

import { formatMacroValue } from '../../utils/formatters';

interface MacroProgressProps {
  label: string;
  consumed: number;
  goal: number | null;
  type: 'carbohydrates' | 'protein' | 'fat' | 'calories';
}

/**
 * Get color based on percentage consumed
 */
function getProgressColor(percentage: number): string {
  if (percentage < 100) return 'bg-green-500';
  if (percentage <= 110) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * MacroProgress Component
 * Shows consumed/goal ratio with color-coded progress bar
 */
export function MacroProgress({ label, consumed, goal, type }: MacroProgressProps) {
  const percentage = goal ? Math.min((consumed / goal) * 100, 100) : 0;
  const remaining = goal ? Math.max(0, goal - consumed) : 0;
  const progressColor = getProgressColor(goal ? (consumed / goal) * 100 : 0);

  return (
    <div className="space-y-2">
      {/* Label and Values */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-white/90">{label}</span>
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">{formatMacroValue(consumed, type, 0)}</span>
          {goal !== null && (
            <>
              <span className="mx-1">/</span>
              <span>{formatMacroValue(goal, type, 0)}</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {goal !== null && (
        <>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-300 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Remaining */}
          <div className="text-xs text-white/60">
            {remaining > 0 ? (
              <span>{formatMacroValue(remaining, type, 0)} remaining</span>
            ) : (
              <span className="text-yellow-400">Goal reached!</span>
            )}
          </div>
        </>
      )}

      {/* No Goal Set */}
      {goal === null && (
        <div className="text-xs text-white/40 italic">No goal set</div>
      )}
    </div>
  );
}
