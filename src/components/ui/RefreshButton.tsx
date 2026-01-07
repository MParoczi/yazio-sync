'use client';

/**
 * RefreshButton Component
 * Button to manually refresh nutrition data
 */

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNutritionData } from '../../hooks/useNutritionData';

interface RefreshButtonProps {
  className?: string;
}

/**
 * RefreshButton Component
 * Calls refresh() from NutritionContext and shows loading state
 */
export function RefreshButton({ className = '' }: RefreshButtonProps) {
  const { refresh } = useNutritionData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`glass-button text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Refresh data"
      title="Refresh nutrition data"
    >
      <ArrowPathIcon
        className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
      />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );
}
