'use client';

/**
 * ExportButton Component
 * Button to trigger export modal
 */

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DateRangePicker } from '../calendar/DateRangePicker';

interface ExportButtonProps {
  className?: string;
}

/**
 * ExportButton Component
 * Opens DateRangePicker modal for exporting nutrition data
 */
export function ExportButton({ className = '' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`glass-button text-white font-medium flex items-center gap-2 ${className}`}
        aria-label="Export data"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      <DateRangePicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
