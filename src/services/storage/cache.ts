/**
 * In-Memory Nutrition Data Cache
 * 5-minute TTL cache for YAZIO API responses
 */

import { CACHE_TTL } from '../../utils/constants';
import type { DailyNutritionData } from '../../types/nutrition';

interface CacheEntry<T> {
  data: T;
  cachedAt: Date;
  ttl: number;
}

/**
 * In-memory cache for nutrition data
 */
export class NutritionCache {
  private cache: Map<string, CacheEntry<DailyNutritionData>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate cache key from date
   */
  private getCacheKey(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<DailyNutritionData>): boolean {
    const now = new Date();
    const expiresAt = new Date(entry.cachedAt.getTime() + entry.ttl);
    return now > expiresAt;
  }

  /**
   * Get cached data for a date
   * Returns null if not cached or expired
   */
  get(date: Date): DailyNutritionData | null {
    const key = this.getCacheKey(date);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      // Remove expired entry
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store data in cache
   */
  set(date: Date, data: DailyNutritionData): void {
    const key = this.getCacheKey(date);
    this.cache.set(key, {
      data,
      cachedAt: new Date(),
      ttl: CACHE_TTL,
    });
  }

  /**
   * Invalidate cache for a specific date or all cache
   */
  invalidate(date?: Date): void {
    if (date) {
      const key = this.getCacheKey(date);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache size (number of entries)
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
    });
  }
}

// Global cache instance
export const nutritionCache = new NutritionCache();
