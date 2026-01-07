'use client';

/**
 * DateSelector Component
 * Calendar UI for selecting historical dates
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import { useNutritionData } from '../../hooks/useNutritionData';
import { modalBackdrop, modalContent } from '../../utils/animations';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
  format,
} from 'date-fns';

interface DateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

/**
 * Get all days to display in the calendar grid
 */
function getCalendarDays(currentMonth: Date): Date[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
}

/**
 * DateSelector Component
 * Modal calendar for selecting dates
 */
export function DateSelector({ isOpen, onClose, onSelectDate }: DateSelectorProps) {
  const { selectedDate } = useNutritionData();
  const [viewingMonth, setViewingMonth] = useState(selectedDate);
  const today = new Date();

  const calendarDays = useMemo(() => getCalendarDays(viewingMonth), [viewingMonth]);

  /**
   * Navigate to previous month
   */
  const previousMonth = () => {
    setViewingMonth(subMonths(viewingMonth, 1));
  };

  /**
   * Navigate to next month
   */
  const nextMonth = () => {
    // Don't allow navigating to future months
    const nextMonthDate = addMonths(viewingMonth, 1);
    if (!isAfter(startOfMonth(nextMonthDate), startOfMonth(today))) {
      setViewingMonth(nextMonthDate);
    }
  };

  /**
   * Handle date selection
   */
  const handleDateClick = (date: Date) => {
    // Don't allow selecting future dates
    if (isAfter(date, today)) {
      return;
    }

    onSelectDate(date);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
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
        onClick={onClose}
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
          <GlassCard>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Select Date</h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close calendar"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={previousMonth}
                className="glass-button p-2"
                aria-label="Previous month"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>

              <div className="text-lg font-semibold text-white">
                {format(viewingMonth, 'MMMM yyyy')}
              </div>

              <button
                onClick={nextMonth}
                disabled={isAfter(startOfMonth(addMonths(viewingMonth, 1)), startOfMonth(today))}
                className="glass-button p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next month"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-white/60 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, viewingMonth);
                const isSelectedDay = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                const isFuture = isAfter(day, today);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={isFuture}
                    className={`
                      aspect-square p-2 rounded-lg text-sm font-medium transition-all
                      ${isCurrentMonth ? 'text-white' : 'text-white/30'}
                      ${isSelectedDay ? 'bg-white/20 ring-2 ring-white/40' : ''}
                      ${isToday && !isSelectedDay ? 'ring-1 ring-white/30' : ''}
                      ${isFuture ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                    `}
                    aria-label={format(day, 'MMMM d, yyyy')}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            {/* Footer with hint */}
            <div className="mt-4 text-center text-xs text-white/50">
              {isSameDay(selectedDate, today) ? (
                <span>Currently viewing today</span>
              ) : (
                <span>Select a date to view historical data</span>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
