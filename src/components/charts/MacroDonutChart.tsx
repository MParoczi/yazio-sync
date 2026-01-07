/**
 * MacroDonutChart Component
 * Displays macronutrient breakdown as an interactive donut chart
 */

'use client';

import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { MacroValues } from '@/types/nutrition';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface MacroDonutChartProps {
  macros: MacroValues;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  unit: string;
  [key: string]: string | number;
}

const COLORS = {
  carbohydrates: '#3b82f6', // blue
  protein: '#10b981', // green
  fat: '#f59e0b', // amber
};

/**
 * Custom glassmorphism tooltip for macro data
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartData; percent?: number }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="glass-card p-3 border border-white/20">
      <p className="font-semibold text-sm text-foreground">{data.name}</p>
      <p className="text-lg font-bold" style={{ color: data.color }}>
        {data.value.toFixed(1)}g
      </p>
      <p className="text-xs text-foreground/70">
        {payload[0].percent ? `${(payload[0].percent * 100).toFixed(1)}%` : ''}
      </p>
    </div>
  );
}

const MacroDonutChartComponent = ({ macros }: MacroDonutChartProps) => {
  // Check if there's any macro data
  const hasData = macros.carbohydrates > 0 || macros.protein > 0 || macros.fat > 0;

  if (!hasData) {
    return <EmptyState message="No macro data logged today" />;
  }

  // Prepare chart data
  const chartData: ChartData[] = [
    {
      name: 'Carbohydrates',
      value: macros.carbohydrates,
      color: COLORS.carbohydrates,
      unit: 'g',
    },
    {
      name: 'Protein',
      value: macros.protein,
      color: COLORS.protein,
      unit: 'g',
    },
    {
      name: 'Fat',
      value: macros.fat,
      color: COLORS.fat,
      unit: 'g',
    },
  ].filter((item) => item.value > 0); // Only show macros with values

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Macro Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300} minHeight={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-foreground/80">
              {item.name}: <span className="font-semibold">{item.value.toFixed(1)}g</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Memoized export to prevent unnecessary re-renders when parent updates
export const MacroDonutChart = memo(MacroDonutChartComponent);
