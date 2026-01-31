/**
 * Cache utilities
 */
import { LRUCache } from 'lru-cache';

// Create a cache instance
const cache = new LRUCache({
  max: 1000, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes TTL
  updateAgeOnGet: true, // Update age on get
  allowStale: false // Don't allow stale data
});

/**
 * Get item from cache
 * @param {string} key - Cache key
 * @returns {any} Cached value or undefined
 */
export function get(key) {
  return cache.get(key);
}

/**
 * Set item in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds (optional)
 */
export function set(key, value, ttl) {
  cache.set(key, value, ttl ? { ttl } : undefined);
}

/**
 * Delete item from cache
 * @param {string} key - Cache key
 * @returns {boolean} True if item was deleted
 */
export function del(key) {
  return cache.delete(key);
}

/**
 * Clear entire cache
 */
export function clear() {
  cache.clear();
}

/**
 * Get cache stats
 * @returns {Object} Cache statistics
 */
export function stats() {
  return {
    size: cache.size,
    maxSize: cache.max,
    itemCount: cache.itemCount
  };
}