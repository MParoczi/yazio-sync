/**
 * MealBarChart Component
 * Displays calories per meal as an interactive bar chart
 */

'use client';

import React, { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MealGroup } from '@/types/nutrition';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface MealBarChartProps {
  meals: MealGroup[];
}

interface ChartData {
  name: string;
  calories: number;
  color: string;
  [key: string]: string | number;
}

const MEAL_COLORS = {
  breakfast: '#f59e0b', // amber
  lunch: '#3b82f6', // blue
  dinner: '#8b5cf6', // purple
  snack: '#10b981', // green
};

/**
 * Custom glassmorphism tooltip for meal data
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
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
        {data.calories.toFixed(0)} kcal
      </p>
    </div>
  );
}

const MealBarChartComponent = ({ meals }: MealBarChartProps) => {
  // Check if there's any meal data
  const hasData = meals.some((meal) => meal.summary.calories > 0);

  if (!hasData) {
    return <EmptyState message="No meal data logged today" />;
  }

  // Prepare chart data - ensure all 4 meals are represented
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  const chartData: ChartData[] = mealTypes.map((mealType) => {
    const meal = meals.find((m) => m.type === mealType);
    // Capitalize first letter for display
    const displayName = mealType.charAt(0).toUpperCase() + mealType.slice(1);
    return {
      name: displayName,
      calories: meal?.summary.calories || 0,
      color: MEAL_COLORS[mealType],
    };
  });

  // Calculate max value for Y-axis scaling
  const maxCalories = Math.max(...chartData.map((d) => d.calories));
  const yAxisMax = Math.ceil(maxCalories * 1.2 / 100) * 100; // Round up to nearest 100

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Calories by Meal
      </h3>
      <ResponsiveContainer width="100%" height={300} minHeight={250}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            stroke="currentColor"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            stroke="currentColor"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'currentColor' }}
            domain={[0, yAxisMax]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar
            dataKey="calories"
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData
          .filter((item) => item.calories > 0)
          .map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-foreground/80">
                {item.name}: <span className="font-semibold">{item.calories.toFixed(0)} kcal</span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

// Memoized export to prevent unnecessary re-renders when parent updates
export const MealBarChart = memo(MealBarChartComponent);
