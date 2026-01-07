'use client';

/**
 * DateRangePicker Component
 * Modal for selecting date range for export
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useExport } from '../../hooks/useExport';
import { formatDate } from '../../utils/formatters';
import { MAX_EXPORT_RANGE_DAYS } from '../../utils/constants';
import { modalBackdrop, modalContent } from '../../utils/animations';
import { subDays, startOfDay } from 'date-fns';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DateRangePicker Component
 * Modal for selecting start and end dates for export
 */
export function DateRangePicker({ isOpen, onClose }: DateRangePickerProps) {
  const today = startOfDay(new Date());
  const { isExporting, progress, exportRange } = useExport();

  // Default to last 7 days
  const [startDate, setStartDate] = useState<string>(
    formatDate(subDays(today, 6), 'API')
  );
  const [endDate, setEndDate] = useState<string>(
    formatDate(today, 'API')
  );

  /**
   * Handle export
   */
  const handleExport = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    await exportRange(start, end);

    // Close modal on success
    if (!isExporting) {
      onClose();
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isExporting) {
      onClose();
    }
  };

  /**
   * Quick select presets
   */
  const selectPreset = (days: number) => {
    setStartDate(formatDate(subDays(today, days - 1), 'API'));
    setEndDate(formatDate(today, 'API'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={!isExporting ? onClose : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          variants={modalContent}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-md"
        >
          <GlassCard className="relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Export Data</h2>
              {!isExporting && (
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm mb-6">
              Select a date range to export your nutrition data to a .txt file.
              Maximum range: {MAX_EXPORT_RANGE_DAYS} days.
            </p>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => selectPreset(7)}
                  disabled={isExporting}
                  className="glass-button text-white text-sm py-2 disabled:opacity-50"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => selectPreset(14)}
                  disabled={isExporting}
                  className="glass-button text-white text-sm py-2 disabled:opacity-50"
                >
                  Last 14 days
                </button>
                <button
                  onClick={() => selectPreset(30)}
                  disabled={isExporting}
                  className="glass-button text-white text-sm py-2 disabled:opacity-50"
                >
                  Last 30 days
                </button>
              </div>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4 mb-6">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  disabled={isExporting}
                  className="glass-input w-full disabled:opacity-50"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={formatDate(today, 'API')}
                  disabled={isExporting}
                  className="glass-input w-full disabled:opacity-50"
                />
              </div>
            </div>

            {/* Progress Bar */}
            {isExporting && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Exporting...</span>
                  <span className="text-sm font-semibold text-white">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="glass-button text-white font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="glass-button text-white font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
