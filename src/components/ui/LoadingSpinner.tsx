/**
 * LoadingSpinner Component
 * Animated loading spinner with glassmorphism styling
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlay?: boolean;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
  overlay = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={`${sizeClasses[size]} ${className} text-white`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl z-10">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="glass-card flex flex-col items-center gap-4 p-8">
        <LoadingSpinner size="lg" />
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
