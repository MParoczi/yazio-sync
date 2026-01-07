/**
 * GlassCard Component
 * Reusable glassmorphism container component
 */

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({
  children,
  className = '',
  padding = 'md',
}: GlassCardProps) {
  return (
    <div className={`glass-card ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
