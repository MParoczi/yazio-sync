'use client';

/**
 * Dashboard Page
 * Displays daily nutrition data with meals and summaries
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useNutritionData } from '../../hooks/useNutritionData';
import { useCalendar } from '../../hooks/useCalendar';
import { LogoutButton } from '../../components/auth/LogoutButton';
import { RefreshButton } from '../../components/ui/RefreshButton';
import { ExportButton } from '../../components/export/ExportButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { GlassCard } from '../../components/ui/GlassCard';
import { DailySummaryCard } from '../../components/dashboard/DailySummaryCard';
import { MealSection } from '../../components/dashboard/MealSection';
import { DateSelector } from '../../components/calendar/DateSelector';
import { MacroDonutChart } from '../../components/charts/MacroDonutChart';
import { MealBarChart } from '../../components/charts/MealBarChart';
import { formatDate } from '../../utils/formatters';
import { pageFadeIn, cardStagger } from '../../utils/animations';

export default function DashboardPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  const { nutritionData, isLoading: dataLoading, error, selectedDate } = useNutritionData();
  const { isOpen, openCalendar, closeCalendar, selectDate, goToToday, isToday } = useCalendar();

  const isTodaySelected = isToday(selectedDate);

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!authLoading && !session?.isAuthenticated) {
      router.push('/');
    }
  }, [session, authLoading, router]);

  /**
   * Show loading spinner during auth check
   */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  /**
   * Don't render if not authenticated
   */
  if (!session?.isAuthenticated) {
    return null;
  }

  /**
   * Show loading state while fetching data
   */
  if (dataLoading && !nutritionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  /**
   * Show error state
   */
  if (error && !nutritionData) {
    return (
      <motion.div
        className="min-h-screen p-4 md:p-8"
        variants={pageFadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={openCalendar}
                className="glass-button text-white font-medium flex items-center gap-2"
                aria-label="Open calendar"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <ExportButton />
              <RefreshButton />
              <LogoutButton />
            </div>
          </div>

          {/* Error Message */}
          <GlassCard>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Failed to Load Data
              </h2>
              <p className="text-white/70 mb-6">{error}</p>
              <RefreshButton className="mx-auto" />
            </div>
          </GlassCard>
        </div>

        {/* Date Selector Modal */}
        <DateSelector isOpen={isOpen} onClose={closeCalendar} onSelectDate={selectDate} />
      </motion.div>
    );
  }

  /**
   * Show nutrition data
   */
  return (
    <motion.div
      className="min-h-screen p-4 md:p-8"
      variants={pageFadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            {/* Date Display */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/70">
                {isTodaySelected ? (
                  'Today'
                ) : (
                  <span className="text-yellow-300">
                    Viewing: {formatDate(selectedDate, 'DISPLAY')}
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Today Button - Only show when not viewing today */}
            {!isTodaySelected && (
              <button
                onClick={goToToday}
                className="glass-button text-white font-medium"
              >
                Today
              </button>
            )}

            {/* Calendar Button */}
            <button
              onClick={openCalendar}
              className="glass-button text-white font-medium flex items-center gap-2"
              aria-label="Open calendar"
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>

            <ExportButton />
            <RefreshButton />
            <LogoutButton />
          </div>
        </div>

        {nutritionData ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              className="space-y-6"
              variants={cardStagger}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Daily Summary */}
              <DailySummaryCard
                summary={nutritionData.summary}
                date={nutritionData.date}
              />

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GlassCard className="min-h-[400px]">
                  <MacroDonutChart macros={nutritionData.summary.consumed} />
                </GlassCard>
                <GlassCard className="min-h-[400px]">
                  <MealBarChart meals={nutritionData.meals} />
                </GlassCard>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutritionData.meals.map((meal) => (
                  <MealSection key={meal.type} meal={meal} />
                ))}
              </div>

              {/* Loading Overlay during refresh */}
              {dataLoading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                  <LoadingSpinner size="lg" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <GlassCard>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                No Data Available
              </h2>
              <p className="text-white/70 mb-6">
                Click refresh to load your nutrition data.
              </p>
              <RefreshButton className="mx-auto" />
            </div>
          </GlassCard>
        )}
      </div>

      {/* Date Selector Modal */}
      <DateSelector isOpen={isOpen} onClose={closeCalendar} onSelectDate={selectDate} />
    </motion.div>
  );
}
