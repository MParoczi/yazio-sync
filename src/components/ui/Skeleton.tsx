/**
 * Skeleton Component
 * Loading placeholder with shimmer animation
 */

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * Skeleton loading component with glassmorphism styling
 */
export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'bg-white/10 animate-pulse';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * Skeleton card for dashboard loading state
 */
export function SkeletonCard() {
  return (
    <div className="glass-card space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/**
 * Skeleton for meal section
 */
export function SkeletonMealSection() {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between py-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for daily summary
 */
export function SkeletonDailySummary() {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
