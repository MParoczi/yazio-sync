/**
 * EmptyState Component
 * Displays empty state message with icon
 */

import { DocumentIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

/**
 * EmptyState Component
 * Shows centered message when no data is available
 */
export function EmptyState({
  message = 'No items logged',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-white/30 mb-3">
        {icon || <DocumentIcon className="w-12 h-12" />}
      </div>
      <p className="text-white/50 text-sm">{message}</p>
    </div>
  );
}
